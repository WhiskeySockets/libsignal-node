#include <stddef.h>
#include <string.h>
#include "sph_sha2.h"

int crypto_hash_sha512_ref(unsigned char *out, const unsigned char *in, unsigned long long inlen)
{
    sph_sha512_context ctx;
    
    sph_sha512_init(&ctx);
    sph_sha512(&ctx, in, (size_t)inlen);
    sph_sha512_close(&ctx, out);
    
    return 0;
}
