from flask import Blueprint, request, jsonify, current_app, render_template 
import datetime
import jwt
import os
from backend.db import (
    create_user, get_user_by_email, check_user_password, update_user_password,
    create_password_reset_token, get_password_reset_token, delete_password_reset_token,
    get_user_by_id # Eğer db.py'ye eklediyseniz
)
# tokens.py şimdi auth.py ile aynı dizinde
from backend.tokens import generate_jwt_token, generate_password_reset_url_token, verify_jwt_token
from email.mime.image import MIMEImage # <<< ADD THIS IMPORT

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username') # <<< EKLEME: Request'ten username'i alıyoruz
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password: # <<< EKLEME: username'in boş olup olmadığını kontrol ediyoruz
        return jsonify({"message": "Kullanıcı adı, e-posta ve şifre gerekli."}), 400

    if "@" not in email or "." not in email:
        return jsonify({"message": "Geçersiz e-posta formatı."}), 400

    # <<< EKLEME: create_user fonksiyonuna username'i gönderiyoruz
    success, result = create_user(username, email, password)

    if success:
        user_data = {
            'id': result['id'],
            'username': result['username'], # <<< EKLEME: JWT'ye username'i ekliyoruz
            'email': result['email']
        }
        token = generate_jwt_token(user_data)

        if token is None:
            return jsonify({"message": "Kayıt başarılı ancak oturum başlatılamadı."}), 500

        return jsonify({"message": "Kayıt başarılı!", "token": token}), 201
    else:
        return jsonify({"message": result}), 409

# --- Giriş (Login) Rotası ---
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(message="E-posta ve şifre gerekli."), 400

    user = check_user_password(email, password)

    if user:
        # JWT oluşturmak için yeni yardımcı fonksiyonu kullan
        user_data = {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
        token = generate_jwt_token(user_data) # Token oluşturma süresi varsayılan olarak 1 saat

        if token is None: # Token oluşturmada hata olursa
            return jsonify(message="Giriş başarılı ancak oturum başlatılamadı."), 500

        return jsonify(message="Giriş başarılı!", token=token), 200
    else:
        return jsonify(message="Geçersiz e-posta veya şifre."), 401

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify(message="E-posta adresi gerekli."), 400

    user = get_user_by_email(email)
    if not user:
        print(f"Bilgi: Kayıtlı olmayan e-posta için şifre sıfırlama isteği: {email}")
        return jsonify(message="Şifre sıfırlama bağlantısı e-posta adresinize gönderildi (eğer kayıtlıysa)."), 200

    try:
        raw_token = generate_password_reset_url_token()
        success, token_db_info = create_password_reset_token(user['id'], raw_token)
        if not success:
            raise Exception(token_db_info)

        reset_url = f"http://localhost:3000/reset-password?token={raw_token}"

        from flask_mail import Message # Keep this here

        html_body = render_template(
            'password_reset_email.html',
            username=user['username'],
            reset_url=reset_url
        )

        msg = Message("Şifre Sıfırlama İsteği",
                      recipients=[email])
        msg.html = html_body
        msg.send_html_alt = f"""Merhaba {user['username']},\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n{reset_url}\n\nBu bağlantı 30 dakika içinde geçerliliğini yitirecektir.\nEğer bu isteği siz yapmadıysanız, bu e-postayı dikkate almayın.\n\nSaygılarımızla,\nUygulama Adınız Ekibi"""

        logo_path = os.path.join(current_app.root_path, 'templates', 'akyapilogo.png')

        if os.path.exists(logo_path):
            # <<< YOU MUST HAVE THIS 'WITH' STATEMENT TO DEFINE 'fp'
            with current_app.open_resource(logo_path) as fp:
                msg.attach(
                    "akyapilogo.png",
                    "image/png",
                    fp.read(), # fp is now defined here
                    'inline'   # No 'headers' argument
                )
        else:
            print(f"Uyarı: Logo dosyası bulunamadı: {logo_path}")

        current_app.extensions['mail'].send(msg)

        print(f"Şifre sıfırlama e-postası gönderildi: {email}")
        return jsonify(message="Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."), 200

    except Exception as e:
        print(f"Şifre sıfırlama e-postası gönderme hatası: {e}")
        import traceback
        traceback.print_exc()
        return jsonify(message="Bir hata oluştu. Lütfen tekrar deneyin."), 500


# --- Şifre Sıfırla (Reset Password) Rotası ---
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')

    if not token or not new_password:
        return jsonify(message="Geçersiz istek. Token veya yeni şifre eksik."), 400

    try:
        # Token'ı veritabanından al ve geçerliliğini kontrol et
        token_data = get_password_reset_token(token)
        if not token_data:
            return jsonify(message="Geçersiz veya bulunamayan şifre sıfırlama bağlantısı."), 400

        if token_data['expires_at'] < datetime.datetime.utcnow():
            delete_password_reset_token(token)
            return jsonify(message="Şifre sıfırlama bağlantısının süresi dolmuş."), 400

        # Kullanıcıyı user_id ile veritabanından getir
        user = get_user_by_id(token_data['user_id']) # db.py'ye bu fonksiyonu eklediğinizden emin olun
        if not user:
             return jsonify(message="Kullanıcı bulunamadı."), 404

        # Yeni şifreyi güncelle
        success, message = update_user_password(user['id'], new_password) # update_user_password şifreyi hash'lemeli!
                                                                         # Bu fonksiyonun hashleme yaptığından emin olun.
        if not success:
            raise Exception(message)

        # Token'ı kullandıktan sonra veritabanından sil
        delete_password_reset_token(token)

        print(f"Şifre güncellendi. Kullanıcı ID: {user['id']}")
        return jsonify(message="Şifreniz başarıyla güncellendi!"), 200

    except jwt.ExpiredSignatureError: # Bu hata JWT doğrulamadan gelirse
        return jsonify(message="Şifre sıfırlama bağlantısının süresi dolmuş."), 400
    except jwt.InvalidTokenError: # Bu hata JWT doğrulamadan gelirse
        return jsonify(message="Geçersiz şifre sıfırlama bağlantısı."), 400
    except Exception as e:
        print(f"Şifre sıfırlama hatası: {e}")
        return jsonify(message="Sunucu hatası. Lütfen daha sonra tekrar deneyin."), 500