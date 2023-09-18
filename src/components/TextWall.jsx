import { Text } from "@react-three/drei";
import { loremText, scrollText } from "../assets/text";

function TextWall() {
  return (
    <group position={[0, 0, -12]}>
      <Text
        color={"#EC2D2D"}
        fontSize={2}
        maxWidth={75}
        lineHeight={1}
        letterSpacing={0.02}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        textAlign={"justify"}
        anchorX={"right"}
        position={[-10, -25, 0]}>
        {loremText}
      </Text>
      <Text
        color={"#EC2D2D"}
        fontSize={6.3}
        maxWidth={1}
        lineHeight={1}
        letterSpacing={0.02}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        textAlign={"justify"}
        position={[0, -25, 0]}>
        {scrollText}
      </Text>
      <Text
        color={"#EC2D2D"}
        fontSize={2}
        maxWidth={75}
        lineHeight={1}
        letterSpacing={0.02}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        textAlign={"justify"}
        anchorX={"left"}
        position={[10, -25, 0]}>
        {loremText}
      </Text>
    </group>
  );
}

export default TextWall;
