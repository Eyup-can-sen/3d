# python-backend/utils/tokens.py

import jwt
import datetime
import secrets
from flask import current_app  # Flask uygulama bağlamına erişmek için

def generate_jwt_token(user_data, expires_in_hours=1):
    """
    Kullanıcı verilerine dayanarak bir JWT token oluşturur.
    `user_data` sözlüğü 'id', 'username', 'email' gibi anahtarlar içermelidir.
    """
    try:
        # Debug: JWT kütüphane bilgisi
        print(f"🔍 JWT Kütüphane Versiyonu: {jwt.__version__}")
        print(f"📦 User Data: {user_data}")

        # Payload oluştur
        payload = {
            'id': user_data['id'],
            'username': user_data['username'],
            'email': user_data['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expires_in_hours),
            'iat': datetime.datetime.utcnow()  # Token oluşturulma zamanı
        }

        print(f"🔐 Payload oluşturuldu: {payload.keys()}")

        # SECRET_KEY kontrolü
        try:
            secret_key = current_app.config['SECRET_KEY']
            if not secret_key:
                print("⚠️ SECRET_KEY boş!")
                return None
            print(f"🔑 SECRET_KEY mevcut: {len(secret_key)} karakter")
        except Exception as secret_error:
            print(f"💥 SECRET_KEY erişim hatası: {secret_error}")
            # Fallback secret (sadece geliştirme için)
            secret_key = 'fallback-secret-key-123-development-only'
            print(f"🔄 Fallback SECRET_KEY kullanılıyor")

        # JWT encode
        print(f"🔨 JWT encode başlıyor...")
        token = jwt.encode(payload, secret_key, algorithm='HS256')

        # PyJWT 2.0+ versiyonunda token zaten string
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        print(f"✅ JWT Token oluşturuldu: {len(token)} karakter")
        print(f"🎯 Token başlangıcı: {token[:20]}...")

        return token

    except AttributeError as attr_error:
        print(f"💥 JWT AttributeError: {attr_error}")
        print(f"💥 JWT metodları: {[m for m in dir(jwt) if not m.startswith('_')]}")
        return None
    except Exception as e:
        print(f"💥 JWT token oluşturma hatası: {e}")
        print(f"💥 Hata tipi: {type(e).__name__}")
        print(f"💥 JWT modül bilgisi: {jwt}")
        return None


def verify_jwt_token(token):
    """
    Verilen JWT token'ı doğrular ve payload'ını döndürür.
    Geçersiz veya süresi dolmuş token'larda None döndürür.
    """
    try:
        print(f"🔍 Token doğrulama başlıyor: {token[:20]}...")

        # SECRET_KEY al
        try:
            secret_key = current_app.config['SECRET_KEY']
            if not secret_key:
                print("⚠️ SECRET_KEY boş!")
                return None
        except Exception as secret_error:
            print(f"💥 SECRET_KEY erişim hatası: {secret_error}")
            secret_key = 'fallback-secret-key-123-development-only'

        # Token decode
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        print(f"✅ Token doğrulandı: {payload.get('username', 'N/A')}")

        return payload

    except jwt.ExpiredSignatureError:
        print("⏰ JWT token süresi doldu.")
        return None
    except jwt.InvalidTokenError as invalid_error:
        print(f"❌ Geçersiz JWT token: {invalid_error}")
        return None
    except Exception as e:
        print(f"💥 JWT token doğrulama hatası: {e}")
        print(f"💥 Hata tipi: {type(e).__name__}")
        return None


def generate_password_reset_url_token():
    """
    Şifre sıfırlama URL'inde kullanılacak güvenli, rastgele bir token oluşturur.
    """
    try:
        token = secrets.token_urlsafe(32)  # 32 bayt rastgele veri = yaklaşık 43 karakterlik URL güvenli dize
        print(f"🔗 Password reset token oluşturuldu: {len(token)} karakter")
        return token
    except Exception as e:
        print(f"💥 Password reset token hatası: {e}")
        return None


# Debug fonksiyonu - JWT kurulumunu test etmek için
def test_jwt_setup():
    """JWT kurulumunu test eder - sadece debug için"""
    try:
        print(f"🧪 JWT Test Başlıyor...")
        print(f"📊 JWT Versiyonu: {jwt.__version__}")
        print(f"🔧 JWT Metodları: {[m for m in dir(jwt) if not m.startswith('_')]}")

        # Basit test
        test_payload = {"test": "data", "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}
        test_secret = "test-secret-123"

        test_token = jwt.encode(test_payload, test_secret, algorithm='HS256')
        print(f"✅ Test token oluşturuldu: {len(test_token) if test_token else 'None'}")

        if test_token:
            decoded = jwt.decode(test_token, test_secret, algorithms=['HS256'])
            print(f"✅ Test token doğrulandı: {decoded}")
            return True

        return False

    except Exception as e:
        print(f"💥 JWT Test hatası: {e}")
        return False
