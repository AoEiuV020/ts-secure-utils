import localUnitTest from './LocalUnit.test';
import base64Test from './Base64.test';
import textEncoderTest from './Encoder.test';
import hexTest from './Hex.test';
import md5Test from './MD5.test';
import aesTest from './AES.test';
import utf8Test from './UTF8.test';
import rsaTest from './RSA.test';

export default function testsuite() {
  localUnitTest();
  textEncoderTest();
  base64Test();
  utf8Test();
  hexTest();
  md5Test();
  aesTest();
  rsaTest();
}