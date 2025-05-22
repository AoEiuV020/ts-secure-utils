import localUnitTest from './LocalUnit.test';
import base64Test from './Base64.test';
import textEncoderTest from '../ohosTest/ets/test/Encoder.test';

export default function testsuite() {
  localUnitTest();
  textEncoderTest();
  base64Test();
}