#include <string.h>
#include <stdlib.h>
#include "ge.h"
#include "curve_sigs.h"
#include "crypto_sign.h"

void curve25519_keygen(unsigned char* curve25519_pubkey_out,
                       unsigned char* curve25519_privkey_in)
{
  ge_p3 ed_pubkey_point; /* Ed25519 pubkey point */
  unsigned char ed_pubkey[32]; /* privkey followed by pubkey */
  fe ed_y, one, ed_y_plus_one, one_minus_ed_y, inv_one_minus_ed_y;
  fe mont_x;

  /* Perform a fixed-base multiplication of the Edwards base point,
     (which is efficient due to precalculated tables), then convert
     to the Curve25519 montgomery-format public key.  In particular,
     convert Curve25519's "montgomery" x-coordinate into an Ed25519
     "edwards" y-coordinate:

     mont_x = (ed_y +1 1) / (1 - ed_y)
  */

  ge_scalarmult_base(&ed_pubkey_point, curve25519_privkey_in);
  ge_p3_tobytes(ed_pubkey, &ed_pubkey_point);
  ed_pubkey[31] = ed_pubkey[31] & 0x7F; /* Mask off sign bit */
  fe_frombytes(ed_y, ed_pubkey);

  fe_1(one);
  fe_add(ed_y_plus_one, ed_y, one);
  fe_sub(one_minus_ed_y, one, ed_y);  
  fe_invert(inv_one_minus_ed_y, one_minus_ed_y);
  fe_mul(mont_x, ed_y_plus_one, inv_one_minus_ed_y);
  fe_tobytes(curve25519_pubkey_out, mont_x);    
}

void curve25519_sign(unsigned char* signature_out,
                     unsigned char* curve25519_privkey,
                     unsigned char* msg, unsigned long msg_len)
{
  ge_p3 ed_pubkey_point; /* Ed25519 pubkey point */
  unsigned char ed_keypair[64]; /* privkey followed by pubkey */
  unsigned char* sigbuf = (unsigned char*)malloc(msg_len + 64); /* working buffer */
  unsigned long long sigbuf_out_len = 0;
  unsigned char sign_bit = 0;

  /* Convert the Curve25519 privkey to an Ed25519 keypair */
  memmove(ed_keypair, curve25519_privkey, 32);
  ge_scalarmult_base(&ed_pubkey_point, curve25519_privkey);
  ge_p3_tobytes(ed_keypair + 32, &ed_pubkey_point);
  sign_bit = ed_keypair[63] & 0x80;

  /* Perform an Ed25519 signature with explicit private key */
  crypto_sign_modified(sigbuf, &sigbuf_out_len, msg, msg_len, ed_keypair);
  memmove(signature_out, sigbuf, 64);

  /* Encode the sign bit into signature (in unused high bit of S) */
  signature_out[63] &= 0x7F; /* bit should be zero already, but just in case */
  signature_out[63] |= sign_bit;
  
  free(sigbuf);
}

int curve25519_verify(unsigned char* signature,
                      unsigned char* curve25519_pubkey,
                      unsigned char* msg, unsigned long msg_len)
{
  fe mont_x, mont_x_minus_one, mont_x_plus_one, inv_mont_x_plus_one;
  fe one;
  fe ed_y;
  unsigned char ed_pubkey[32];
  unsigned long long some_retval;
  unsigned char* verifybuf = NULL;
  unsigned char* verifybuf2 = NULL;
  int retval;

  /* Convert the Curve25519 public key into an Ed25519 public key.  In
     particular, convert Curve25519's "montgomery" x-coordinate into an
     Ed25519 "edwards" y-coordinate:

     ed_y = (mont_x - 1) / (mont_x + 1)

     NOTE: mont_x=-1 is converted to ed_y=0 since fe_invert is mod-exp
  */
  fe_frombytes(mont_x, curve25519_pubkey);
  fe_1(one);
  fe_sub(mont_x_minus_one, mont_x, one);
  fe_add(mont_x_plus_one, mont_x, one);
  fe_invert(inv_mont_x_plus_one, mont_x_plus_one);
  fe_mul(ed_y, mont_x_minus_one, inv_mont_x_plus_one);
  fe_tobytes(ed_pubkey, ed_y);

  /* Copy the sign bit, and remove it from signature */
  ed_pubkey[31] &= 0x7F;  /* bit should be zero already, but just in case */
  ed_pubkey[31] |= (signature[63] & 0x80);
  signature[63] &= 0x7F;

  /* Allocate buffers for verification */
  verifybuf = (unsigned char*)malloc(msg_len + 64);
  verifybuf2 = (unsigned char*)malloc(msg_len + 64);

  memmove(verifybuf, signature, 64);
  memmove(verifybuf+64, msg, msg_len);

  /* Perform an Ed25519 verification */
  retval = crypto_sign_open(verifybuf2, &some_retval, verifybuf, 64 + msg_len, ed_pubkey);

  free(verifybuf);
  free(verifybuf2);
  
  return retval;
}
