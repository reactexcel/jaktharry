import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = {
    "type": "service_account",
    "project_id": "jak-application",
    "private_key_id": "e25167044f3cefcd7dd3b7177ae3ceea136c3493",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDyqXNRBNhDkuJu\nLrUJKOpvurhpvoepB1MrPUcdFjR/Su6e3B0mn5mw3UVvp8/cwtl6wtjEPon+bUju\nw+Yd+pfSqq5Cjppi0MTsS4OpVOoYLA15mcn08U5s0PskYMfxCZGe4bCn7RAOdKzC\naYX6P+d11K4j9R6bna7HEFyW43ocmWK9WNCJqqLG4xWORwRGtWPFsyvHQcX5O+xj\n30JYKhha71Ld0DPoJ9dhapiCmlY/rqLgyQD8GCQEG0E7MiZKZnweKipn/RFeD5F6\n7SegwrbeSFcMFm2wzpSOrw9c6ecEP4HpZtT8GVfXeUmSsTBoXUVLT3nggWEZ62HY\nBXO0fbr3AgMBAAECggEAcsdx8zWeccANeF6BZRbEZRrl1aa4llwPm9k9ROXW6Qrx\neZTV+Qnu8XiIOnse1+YWZnm5fIG0VfMtVzq0IyQAIjZ3fKXlIq5rJvXFDhhLLinQ\nKd9zZnepR9FFqXxZtop3JbbND3ETcjL/8GlnZOpLOjHiOMHdu2/HVwNHOFvay6Fa\nCAklLp0qtaraM0uUZIsWRCLdLMfLZFuWiA6w82LYzARDrVFM/hBCZQurPr6a/Mdo\nerdxGQw5fX36Sxrrb/Tlv7mutm3XXGeQZznVgH8P0YBJv5EAaS4peLOVmpcirEZ8\n9hfBSvqrAB/XgHDNnQja7JZr4yZpFotj9/C3/ix1UQKBgQD6b8jsyBScgHAFataW\n44zXTzLUYvNiUPxFTSFBImj6SDU8ND0tV0cRnSTDajLNeYQruDVJmJ1dlBs5H8JE\n4tIvGIuZhiwjBaMdk6yrvfZC8RQFDnNZLfWuqxU33lg8VG0Uqa0UaLKzvmMwTQcd\nm6u5ZefHXbmP9lSmJf0nwG0F6QKBgQD4DXOBBYZBtjaMDbBESvlamOVt1SgT1LhM\nsBTACvg5SzJl/tEmh+pn/aaxJLXodc8eMML9E5xQ6EMoOzz0g/GjkocZtIf4bUKR\nbbhnyE0fkCYMPfrRGulToplikk7+vJimRrKuEBPJDCezR4c5C5XKYhx8GaqBlCEf\nPzPxSTrN3wKBgQDWMBMFSB4wt7yXNYfwpw9G+op7kWGdXaxUzSG65mYoYOd+5SLJ\ni5LR4reVlld62woKplKU7jzw0wHxelMZvXCMLQ8AL/vBvEmEu097100udadsp65J\nwIAWcmYEUVrfxklA2dmY0e68wgFtRwPl88UMHLb+EQ/qq4A8VdNNU0srOQKBgQDM\n1w7TNSSxjy9saMFvJBrW3fxYvvXhqoCnk6EPFf/2EEsGP2+oSgUg6y6EirRNyzvG\nyq27ID6t8Z/D0Wd85JjfY1l9uL+wP0oBnoHx8k7+CaPh6C0AESEtl9Divb/OTSAh\n77AOXeh41jjSq/bW/OItxueO9AMCDrlrfF4Am2CcMQKBgDaED1c+8ilcmebJ1/LL\nxoGtKQudsmkIFuYI0na7aUQ8GWBxcwROsRjsdqzF41B//nH5o6BQOpRN3HHRObgi\np6royMdVRFuyKEEE8AL7Bpw9pbmv5zoVwiWeY3GgFUsZ+/k+aukOsPMHYXY3CEb3\n0pErVuy9QFYgDVTLhP9Fhd2C\n-----END PRIVATE KEY-----\n",
    "client_email": "cloud-storage@jak-application.iam.gserviceaccount.com",
    "client_id": "108003985992069186292",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/cloud-storage%40jak-application.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'jak-application.appspot.com'
});

export const bucket = getStorage().bucket(); // Gets a reference to your storage bucket
