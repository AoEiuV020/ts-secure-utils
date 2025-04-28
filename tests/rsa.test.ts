import { Base64, RSA, RsaKeyPair } from "..";

describe("RSA Tests", () => {
  test("genKeyPair should generate valid key pair", () => {
    const pair = RSA.genKeyPair();
    console.log(pair.getPublicKeyBase64());
    console.log(pair.getPrivateKeyBase64());

    expect(pair.publicKey).toBeDefined();
    expect(pair.privateKey).toBeDefined();
    expect(Base64.decode(pair.getPublicKeyBase64())).toEqual(pair.publicKey);
  });

  test("publicEncrypt/decrypt should work", () => {
    const encrypted = RSA.encryptBase64(
      new TextEncoder().encode(content),
      keyPair.publicKey
    );
    const decrypted = RSA.decryptFromBase64(encrypted, keyPair.privateKey);

    expect(new TextDecoder().decode(decrypted)).toBe(content);
  });

  test("pkcs1 key should work", () => {
    const encrypted = RSA.encryptBase64(
      new TextEncoder().encode(content),
      keyPairPkcs1.publicKey
    );
    const decrypted = RSA.decryptFromBase64(encrypted, keyPairPkcs1.privateKey);

    expect(new TextDecoder().decode(decrypted)).toBe(content);
  });

  test("sign and verify should work", () => {
    const signature = RSA.signBase64(content, keyPair.privateKey);
    console.log(signature);
    expect(RSA.verifyFromBase64(content, keyPair.publicKey, signature)).toBe(
      true
    );
  });

  test("verify with wrong content should fail", () => {
    expect(
      RSA.verify(
        new TextEncoder().encode("wrong content"),
        keyPair.publicKey,
        signRaw
      )
    ).toBe(false);
  });

  test("pkcs1 key sign and verify should work", () => {
    const signature = RSA.signBase64(content, keyPairPkcs1.privateKey);
    expect(
      RSA.verifyFromBase64(content, keyPairPkcs1.publicKey, signature)
    ).toBe(true);
  });

  test("precomputed encryption should match", () => {
    const encrypted = RSA.encrypt(contentRaw, keyPair.publicKey);
    console.log(Base64.encode(encrypted));
    // RSA/ECB/PKCS1Padding 每次加密都不同，所以这里不匹配
    expect(encrypted).not.toEqual(encryptedRaw);
  });

  test("precomputed decryption should match", () => {
    const decrypted = RSA.encrypt(encryptedRaw, keyPairPkcs1.privateKey);
    expect(decrypted).toEqual(contentRaw);
  });

  test("precomputed signature should match", () => {
    const signed = RSA.sign(contentRaw, keyPair.privateKey);
    console.log(Base64.encode(signed));
    expect(signed).toEqual(signRaw);
  });

  test("precomputed signature should verify", () => {
    expect(RSA.verify(contentRaw, keyPair.publicKey, signRaw)).toBe(true);
  });

  test("precomputed signature should match sha1", () => {
    const signed = RSA.sign(contentRaw, keyPairPkcs1.privateKey, {
      algorithm: "SHA-1/RSA",
    });
    console.log(Base64.encode(signed));
    expect(signed).toEqual(signRawSha1);
  });

  test("precomputed signature should verify sha1", () => {
    expect(
      RSA.verify(contentRaw, keyPairPkcs1.publicKey, signRawSha1, {
        algorithm: "SHA-1/RSA",
      })
    ).toBe(true);
  });

  test("extractPublicKey should work", () => {
    const extractedPublicKey = RSA.extractPublicKey(keyPair.privateKey);
    expect(extractedPublicKey).toEqual(keyPair.publicKey);
  });

  test("pkcs1 extractPublicKey should work", () => {
    const extractedPublicKey = RSA.extractPublicKey(keyPairPkcs1.privateKey);
    expect(extractedPublicKey).toEqual(keyPairPkcs1.publicKey);
  });
});
const keyPair = new RsaKeyPair(
  Base64.decode(
    `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLjXCd0y8wucMlQDd9S9cFeCA0H
/l/prnouwWgGOEzoaS1gBK4IK0AAiNd7mz8EP+4m9DqeaGW63ei3aws43qV1lDpsVepfJ2PPe/5
VBx7uAKKGqPU+IlNP6EBWUWMMsrCS/oh6LHucCyLah5YhyXOju1cZTfqQ1VFWsbZupmUaQIDAQAB`.replace(
      /\n/g,
      ""
    )
  ),
  Base64.decode(
    `MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIuNcJ3TLzC5wyVAN31L
1wV4IDQf+X+muei7BaAY4TOhpLWAErggrQACI13ubPwQ/7ib0Op5oZbrd6LdrCzjepXWUOmxV6l8
nY897/lUHHu4Aooao9T4iU0/oQFZRYwyysJL+iHose5wLItqHliHJc6O7VxlN+pDVUVaxtm6mZRpA
gMBAAECgYAKHDkodgBZO1wT+s8KWNA/KTDMFfTxdpbJcaM6shK+tttD+v9gL53Y/k6po3hp2qFsM
n20PxOh53VHa1/p8KEU1j+DwLbNC5eIp7/5ZNWwftQTSHBCqSyr+7rE0i6Gcst1qT0ioKUS1fOHI
ZSt0gfBOf1eEzhpLDT1o0QgY98cAQJBANrWFNml89xHZQAUmXvrcC/vzmbfktWuHpTP4gRoURp4U
h7j07xD7dVN/gbk42K70VWCTWTRSARApA9IfjACuqECQQCjQH4hh/2H70b23h3OUfiGUSnhupoNU
z93xTsaBYbwiTGYH81Sno5aQbO3j8H9gi8qZanSHRG24MUVeyQdRYzJAkBHJ0aeQgxZeklHzmrdV
P8kRwfIgTdgDP5aioFFx5lfTvH8oz1MQJYLPhGzsiaRCtqUwApkFnwhDdeKNJr7B1ghAkEAm/knS
TQbp/+VxpGK2q/4iaQMJs3ZF7gc4HrBL+ht92ysxJJF4pT4nwU9BrlD98ik9ZXyPXxmi1qPEin35
Dup+QJBAMQsiQwjjTGoVJpNrXoxHbSwgrHhJrgP4HUX2XKmbjCfem8dWdU93G4/VDFUDcNJyd33x
DOHispMoe+rHwgG0xQ=`.replace(/\n/g, "")
  )
);
const keyPairPkcs1 = new RsaKeyPair(
  Base64.decode(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCjpncvOtMHIp4Bv9sX3JMoSlYKCWsaHdDZ5Oi+QybEDQQlk+MS0wDv+CodsbBFkFwkYcScJzXO/2tM7zVLJR71H761u/woIC5WiBivEMfF6paD0oUM/M440N6ek9ZVONd+W29tnsA+pRVPhN8JhIJaWpuB//UoROXp0PWMjfiZwIDAQAB".replace(
      /\n/g,
      ""
    )
  ),
  Base64.decode(
    "MIICXAIBAAKBgQCCjpncvOtMHIp4Bv9sX3JMoSlYKCWsaHdDZ5Oi+QybEDQQlk+MS0wDv+CodsbBFkFwkYcScJzXO/2tM7zVLJR71H761u/woIC5WiBivEMfF6paD0oUM/M440N6ek9ZVONd+W29tnsA+pRVPhN8JhIJaWpuB//UoROXp0PWMjfiZwIDAQABAoGAd/oYBzRNfzpTPY4guDTWUvlfhzYNuOyffP/4OrJoFS/EyOF45NJlXqS8DdRpPhP3uzzhRd7bIyhsLPj4tWYsZGuyA+GyOjF9Zj/rOWPU1rP4qWSFQ1p9pHvugoi3yt9I1bIqggvUcXk3hdnuVdfSjQE1fY5lpXZvGKB6zNpqZVECQQDuWimYnFgc/1BJtSfCwtKiN0eFMw8S4gTyzWttwOtFxBsHo7Q1l5Xvk564kwZXr2CuOXahrJaDjYm7vNzfoy6bAkEAjDk9QynP8YXQsISPB/X/PxYYpZbAti85sk3JPVO2jb3tAkxCYmIxUg1xgpogaOupqKxeQe83gD8742+5xSXSJQJASuFegghUEkAPjChyZlhobffp6ynASZFiNplcb62U/GUAjOTcH54Qx6Rbz+a4rmF1gSaiY2ZiHtAffjB2P3f3kwJASBx7k9mh1ZwyeUSCZd6tOB096ZJAYrCgpEB6eC5f2D7O7vqWvQ+wO3ksYbSvbCWdZ1/VTWUfDrX2L31adLeBfQJBALGYWVO6Ksv72k1vbSywhLYOKVe3JLZiZgFUNvKLh0g1Tfm1pK29veSSGey8HIkGtI04E6tgQVLx3adZSxjdnFI=".replace(
      /\n/g,
      ""
    )
  )
);
const content = "hello";
const contentRaw = Base64.decode("kolOt/LYqkhf/RZu6aJcIA==");
const encryptedRaw = Base64.decode(
  "a6CIZzAPpzaDysCOE9X5FYp723lsTRia/GVDmU4yyhcKaFX2iBICfVwK5gakKK+NgTQ4veMu0l3wpIHM+eRA+Q6zrxCYjE8tkH1O4Jbxcvx4Nai4QP0JqCXDXNpxJMccKhqyNZ01uBq1RjJ++ATkMt66rt5DMW4pLtToh7nLjhg="
);
const signRaw = Base64.decode(
  "VnEka0wYeYmaG45qW7+RTPH+prTO9ryxrtqyAwpoZOymeQGJTPfkmm+Ti16UJPZetYR1LF+ETQ++XAkuTQIqhu4sgXyuhw4/TIYyMDzaEuEDOciwvJLiyC73E0Q4jXQx6kT8o+65Ki9h4LPxjjr8tOc+/r3U1uhute8/QWWYiuA="
);
const signRawSha1 = Base64.decode(
  "RvxmCkUxhtSPLss712C2vH7jpXaV82QXDe/e9EaclgWuVPEliDPmUkwg20PfG5d/xM0l3LAEexHAUWD3svg6HTWo9zw7/l+fYxtkbv59i8Uz7r5Y+j3HVaHKevFEw2Z34PHbiPXVNYBRE/4Qzl8wLT2ZSLzo50yBBFziD4LgvtU="
);
