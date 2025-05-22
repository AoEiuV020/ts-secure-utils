import abilityTest from './Ability.test';
import base64Test from './Base64.test';
import textEncoderTest from './Encoder.test';

export default function testsuite() {
  abilityTest();
  textEncoderTest();
  base64Test()
}