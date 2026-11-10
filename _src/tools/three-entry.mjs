// Из чего собран js/vendor/three.kc.min.js: только те части three.js, которые нужны сайту.
// Как пересобрать — см. _src/README.md, раздел «3D».
export {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, Group, Object3D, Points,
  Vector2, Vector3, Vector4, Matrix4, Color, MathUtils,
  BufferGeometry, BufferAttribute, Float32BufferAttribute, PlaneGeometry, BoxGeometry,
  Shape, Path, ShapeGeometry, ExtrudeGeometry, TubeGeometry, CurvePath, LineCurve3, CubicBezierCurve3,
  ShaderMaterial, MeshBasicMaterial, MeshStandardMaterial, MeshPhysicalMaterial,
  Texture, CanvasTexture, PMREMGenerator,
  DirectionalLight, AmbientLight, PointLight,
  SRGBColorSpace, LinearSRGBColorSpace, NoColorSpace,
  AdditiveBlending, NormalBlending, DoubleSide, FrontSide, BackSide,
  ACESFilmicToneMapping, NeutralToneMapping, NoToneMapping, PCFSoftShadowMap,
  LinearFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping,
} from "three";
