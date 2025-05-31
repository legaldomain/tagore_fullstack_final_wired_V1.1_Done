import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from fingerprint import FingerprintAuth

def test_verify_user_correct():
    auth = FingerprintAuth()
    assert auth.verify_user("dummy_fingerprint") is True

def test_verify_user_incorrect():
    auth = FingerprintAuth()
    assert auth.verify_user("wrong_fingerprint") is False 