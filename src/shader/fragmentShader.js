const fragmentShader = `
        uniform sampler2D uTexture;
        uniform sampler2D uDisplacement;
        varying vec2 vUv;

        float PI = 3.14159265359;
        
        void main() {

          vec4 displacement = texture2D(uDisplacement, vUv);
          float theta = displacement.r * 2. * PI;

          vec2 dir = vec2(sin(theta), cos(theta));

          vec2 uv = vUv + dir * displacement.r;
          vec4 color = texture2D(uTexture, uv);
         
          
          // Blend the render target with the cloud texture
          gl_FragColor = vec4(color);
        //   gl_FragColor = vec4(displacement);
        }
      `

export default fragmentShader
