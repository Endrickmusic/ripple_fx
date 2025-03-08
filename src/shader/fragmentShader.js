const fragmentShader = `
        uniform sampler2D uTexture;
        uniform sampler2D uDisplacement;
        varying vec2 vUv;

        float PI = 3.14159265359;
        
        void main() {
          vec4 displacement = texture2D(uDisplacement, vUv);
          float theta = displacement.r * 2.0 * PI;
          
          // Slightly different angles for each channel
          float redTheta = theta - 0.05;
          float greenTheta = theta;
          float blueTheta = theta + 0.05;
          
          // Different direction vectors for each channel
          vec2 redDir = vec2(sin(redTheta), cos(redTheta));
          vec2 greenDir = vec2(sin(greenTheta), cos(greenTheta));
          vec2 blueDir = vec2(sin(blueTheta), cos(blueTheta));
          
          // Different displacement strengths
          float strength = displacement.r * 0.5;
          
          // Sample each color channel with different directions and strengths
          float r = texture2D(uTexture, vUv + redDir * strength).r;
          float g = texture2D(uTexture, vUv + greenDir * strength * 0.8).g;
          float b = texture2D(uTexture, vUv + blueDir * strength * 0.6).b;
          
          // Combine the channels
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `

export default fragmentShader
