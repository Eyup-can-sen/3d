# python-backend/db.py

import os
import psycopg2
import datetime # datetime modülünü import edin
from werkzeug.security import generate_password_hash, check_password_hash # Şifre hashleme için
import secrets # Şifre sıfırlama token'ı için

def get_db_connection():
    """Veritabanı bağlantısı kurar ve geri döndürür."""
    try:
        conn = psycopg2.connect(
            host='localhost',                    # Doğrudan URI'den gelen host
            database='AKYAPI_3D_WAREHOUSE',      # Doğrudan URI'den gelen veritabanı adı
            user='postgres',                     # Doğrudan URI'den gelen kullanıcı adı
            password='Ramazan586'                # Doğrudan URI'den gelen şifre
        )
        return conn
    except psycopg2.Error as e:
        print(f"Veritabanı bağlantı hatası: {e}")
        return None

def create_user(username, email, password):
    """Yeni bir kullanıcıyı veritabanına ekler."""
    conn = get_db_connection()
    if conn is None:
        return False, "Veritabanı bağlantısı kurulamadı."

    hashed_password = generate_password_hash(password)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING id;",
            (username, email, hashed_password)
        )
        user_id = cur.fetchone()[0]
        conn.commit() # Değişiklikleri kaydet
        cur.close()
        conn.close()
        return True, {"id": user_id, "username": username, "email": email}
    except psycopg2.errors.UniqueViolation:
        conn.rollback() # İşlemi geri al
        cur.close()
        conn.close()
        return False, "Bu kullanıcı adı veya e-posta zaten kullanımda."
    except Exception as e:
        conn.rollback() # İşlemi geri al
        print(f"Kullanıcı oluşturma hatası: {e}")
        cur.close()
        conn.close()
        return False, "Kullanıcı oluşturulurken bir hata oluştu."

def get_user_by_email(email):
    """E-posta ile kullanıcıyı veritabanından getirir."""
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, password FROM users WHERE email = %s;", (email,))
        user_data = cur.fetchone()
        cur.close()
        conn.close()
        if user_data:
            return {
                "id": user_data[0],
                "username": user_data[1],
                "email": user_data[2],
                "password_hash": user_data[3] # Hashlenmiş şifre
            }
        return None
    except Exception as e:
        print(f"Kullanıcı getirme hatası: {e}")
        return None

def check_user_password(email, password):
    """E-posta ve şifre ile kullanıcıyı doğrular."""
    user = get_user_by_email(email)
    if user and check_password_hash(user["password_hash"], password):
        return user
    return None

def update_user_password(user_id, new_raw_password): # Parametre adını daha net hale getirdim
    """Belirtilen kullanıcının şifresini günceller."""
    conn = get_db_connection()
    if conn is None:
        return False, "Veritabanı bağlantısı kurulamadı."

    # Burası ÖNEMLİ: Şifreyi güncellemeden önce HASH'LE!
    hashed_password = generate_password_hash(new_raw_password)

    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET password = %s WHERE id = %s;",
            (hashed_password, user_id) # Hashlenmiş şifreyi kullan
        )
        conn.commit()
        cur.close()
        conn.close()
        return True, "Şifre başarıyla güncellendi."
    except Exception as e:
        conn.rollback()
        print(f"Şifre güncelleme hatası: {e}")
        cur.close()
        conn.close()
        return False, "Şifre güncellenirken bir hata oluştu."

def create_password_reset_token(user_id, token):
    """
    Kullanıcı için şifre sıfırlama token'ı oluşturur ve veritabanına kaydeder.
    Args:
        user_id (int): Şifresini sıfırlayan kullanıcının ID'si.
        token (str): Oluşturulan rastgele token dizesi.
    Returns:
        tuple: (True, {"token": token, "expires_at": expires_at}) veya (False, "Hata mesajı").
    """
    conn = get_db_connection()
    if conn is None:
        return False, "Veritabanı bağlantısı kurulamadı."

    # Token'ın geçerlilik süresi (örneğin 30 dakika)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)

    try:
        cur = conn.cursor()
        # Daha önce aynı kullanıcıya ait aktif bir token varsa onu geçersiz kıl
        cur.execute("DELETE FROM password_reset_tokens WHERE user_id = %s;", (user_id,))
        conn.commit() # Önceki token'ı silme işlemini kaydet

        cur.execute(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s);",
            (user_id, token, expires_at)
        )
        conn.commit()
        cur.close()
        conn.close()
        return True, {"token": token, "expires_at": expires_at}
    except Exception as e:
        conn.rollback()
        print(f"Şifre sıfırlama token'ı oluşturma hatası: {e}")
        if cur: cur.close()
        if conn: conn.close()
        return False, "Şifre sıfırlama token'ı oluşturulurken bir hata oluştu."

def get_password_reset_token(token):
    """
    Belirtilen token'ı veritabanından getirir ve süresini kontrol eder.
    Args:
        token (str): Şifre sıfırlama token'ı.
    Returns:
        dict: Token bilgileri (user_id, expires_at) veya None.
    """
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT user_id, expires_at FROM password_reset_tokens WHERE token = %s;",
            (token,)
        )
        token_data = cur.fetchone()
        cur.close()
        conn.close()

        if token_data:
            return {
                "user_id": token_data[0],
                "expires_at": token_data[1]
            }
        return None
    except Exception as e:
        print(f"Şifre sıfırlama token'ı getirme hatası: {e}")
        if cur: cur.close()
        if conn: conn.close()
        return None

def delete_password_reset_token(token):
    """
    Belirtilen token'ı veritabanından siler (kullanıldıktan veya süresi dolduktan sonra).
    """
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM password_reset_tokens WHERE token = %s;", (token,))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        conn.rollback()
        print(f"Şifre sıfırlama token'ı silme hatası: {e}")
        if cur: cur.close()
        if conn: conn.close()
        return False

def get_user_by_id(user_id):
    """ID ile kullanıcıyı veritabanından getirir."""
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, password FROM users WHERE id = %s;", (user_id,))
        user_data = cur.fetchone()
        cur.close()
        conn.close()
        if user_data:
            return {
                "id": user_data[0],
                "username": user_data[1],
                "email": user_data[2],
                "password_hash": user_data[3]
            }
        return None
    except Exception as e:
        print(f"ID ile kullanıcı getirme hatası: {e}")
        return None