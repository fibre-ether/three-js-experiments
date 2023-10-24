function shaderConcat(...shaderFiles) {
  let finalShader = "";
  for (const file of shaderFiles) {
    finalShader += file + "\n";
  }
  return finalShader;
}

export default shaderConcat;
