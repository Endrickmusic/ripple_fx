const fragmentShader = `

uniform float uTime;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 uResolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
float PI = 3.1415926;


void main() {

    // Time varying pixel color

    // Output to screen
    vec3 col = vec3(vUv, 0.0);
    gl_FragColor = vec4(col, 1.0);
	
}

`

export default fragmentShader