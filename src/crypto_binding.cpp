#include <napi.h>

extern "C" {
    int curve25519_donna(uint8_t *mypublic, const uint8_t *secret, const uint8_t *basepoint);
    int curve25519_sign(uint8_t *signature, const uint8_t *curve25519_privkey,
                       const uint8_t *msg, const size_t msg_len,
                       const uint8_t *random);
    int curve25519_verify(const uint8_t *signature, const uint8_t *curve25519_pubkey,
                         const uint8_t *msg, const size_t msg_len);
}

Napi::Value Curve25519_Donna(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() != 2) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsBuffer() || !info[1].IsBuffer()) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto secret = info[0].As<Napi::Buffer<uint8_t>>();
    auto basepoint = info[1].As<Napi::Buffer<uint8_t>>();
    
    if (secret.Length() != 32 || basepoint.Length() != 32) {
        Napi::TypeError::New(env, "Inputs must be 32 bytes").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto result = Napi::Buffer<uint8_t>::New(env, 32);
    curve25519_donna(result.Data(), secret.Data(), basepoint.Data());
    
    return result;
}

Napi::Value Curve25519_Sign(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() != 3) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsBuffer() || !info[1].IsBuffer() || !info[2].IsBuffer()) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto privkey = info[0].As<Napi::Buffer<uint8_t>>();
    auto msg = info[1].As<Napi::Buffer<uint8_t>>();
    auto random = info[2].As<Napi::Buffer<uint8_t>>();

    auto signature = Napi::Buffer<uint8_t>::New(env, 64);
    curve25519_sign(signature.Data(), privkey.Data(), msg.Data(), msg.Length(), random.Data());
    
    return signature;
}

Napi::Value Curve25519_Verify(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() != 3) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsBuffer() || !info[1].IsBuffer() || !info[2].IsBuffer()) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto signature = info[0].As<Napi::Buffer<uint8_t>>();
    auto pubkey = info[1].As<Napi::Buffer<uint8_t>>();
    auto msg = info[2].As<Napi::Buffer<uint8_t>>();

    int result = curve25519_verify(signature.Data(), pubkey.Data(), msg.Data(), msg.Length());
    
    return Napi::Boolean::New(env, result == 0);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("curve25519_donna", Napi::Function::New(env, Curve25519_Donna));
    exports.Set("curve25519_sign", Napi::Function::New(env, Curve25519_Sign));
    exports.Set("curve25519_verify", Napi::Function::New(env, Curve25519_Verify));
    return exports;
}

NODE_API_MODULE(signal_crypto, Init)
