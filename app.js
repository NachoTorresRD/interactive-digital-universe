"use strict";

(() => {
  const projects = [
    {
      name: "WHABOT",
      type: "Conversational intelligence",
      description: "Automation shaped as a responsive, always-on communication system.",
      color: "#4dffb8",
      colorHex: 0x4dffb8,
      secondaryHex: 0x1b6f69,
      orbit: "Orbit 2.4 AU",
      live: "https://whabot-sigma.vercel.app/",
      github: "https://github.com/NachoTorresRD/whabot",
      website: "https://whabot-sigma.vercel.app/"
    },
    {
      name: "POSENT",
      type: "Commerce intelligence",
      description: "A point-of-sale ecosystem designed to make complex operations feel immediate.",
      color: "#ffb14d",
      colorHex: 0xffb14d,
      secondaryHex: 0xa84420,
      orbit: "Orbit 3.1 AU",
      live: "https://www.posentrd.com/",
      github: "https://github.com/NachoTorresRD/posent-pro-showcase",
      website: "https://www.posentrd.com/"
    },
    {
      name: "NTDESWEB",
      type: "Creative engineering",
      description: "A digital studio where interface, motion and engineering share the same orbit.",
      color: "#7b8cff",
      colorHex: 0x7b8cff,
      secondaryHex: 0x39429b,
      orbit: "Orbit 4.8 AU",
      live: "https://ntdesweb2-0.vercel.app/",
      github: "https://github.com/NachoTorresRD/ntdesweb2.0",
      website: "https://ntdesweb2-0.vercel.app/"
    },
    {
      name: "NT SKILL SUPREME",
      type: "Design intelligence",
      description: "A design-engineering system for accessible, high-craft digital production.",
      color: "#ff5ca8",
      colorHex: 0xff5ca8,
      secondaryHex: 0x78285f,
      orbit: "Orbit 6.2 AU",
      live: "https://github.com/NachoTorresRD/nt-skill-supreme#readme",
      github: "https://github.com/NachoTorresRD/nt-skill-supreme",
      website: "https://github.com/NachoTorresRD/nt-skill-supreme"
    }
  ];

  const canvas = document.querySelector("#universe");
  const genesis = document.querySelector("#genesis");
  const genesisValue = document.querySelector("#genesis-value");
  const intro = document.querySelector("#intro");
  const enterButton = document.querySelector("#enter-orbit");
  const resetButton = document.querySelector("#reset-view");
  const closeButton = document.querySelector("#close-dossier");
  const dossier = document.querySelector("#world-dossier");
  const labels = [...document.querySelectorAll("[data-label]")];
  const projectButtons = [...document.querySelectorAll("[data-project]")];
  const coordinateX = document.querySelector("#coordinate-x");
  const coordinateY = document.querySelector("#coordinate-y");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = matchMedia("(pointer: coarse)");

  let activeIndex = -1;
  let lockedIndex = -1;
  let hasEntered = false;

  const showDossier = (index, lock = false) => {
    const project = projects[index];
    if (!project) return;
    activeIndex = index;
    if (lock) lockedIndex = index;
    dossier.style.setProperty("--world-color", project.color);
    document.querySelector("#dossier-code").textContent = `WORLD / 0${index + 1}`;
    document.querySelector("#dossier-type").textContent = project.type;
    document.querySelector("#dossier-title").textContent = project.name;
    document.querySelector("#dossier-description").textContent = project.description;
    document.querySelector("#dossier-orbit").textContent = project.orbit;
    document.querySelector("#dossier-live").href = project.live;
    document.querySelector("#dossier-github").href = project.github;
    document.querySelector("#dossier-website").href = project.website;
    dossier.classList.add("is-open");
    dossier.setAttribute("aria-hidden", "false");
    labels.forEach((label, labelIndex) => label.classList.toggle("is-active", labelIndex === index));
    projectButtons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index));
  };

  const clearDossier = (force = false) => {
    if (lockedIndex >= 0 && !force) return;
    activeIndex = -1;
    lockedIndex = -1;
    dossier.classList.remove("is-open");
    dossier.setAttribute("aria-hidden", "true");
    labels.forEach((label) => label.classList.remove("is-active"));
    projectButtons.forEach((button) => button.classList.remove("is-active"));
  };

  const enterUniverse = () => {
    hasEntered = true;
    document.body.classList.add("has-entered");
  };

  enterButton.addEventListener("click", enterUniverse);
  resetButton.addEventListener("click", () => clearDossier(true));
  closeButton.addEventListener("click", () => clearDossier(true));
  projectButtons.forEach((button, index) => button.addEventListener("click", () => {
    enterUniverse();
    showDossier(index, true);
  }));
  addEventListener("keydown", (event) => {
    if (event.key === "Escape") clearDossier(true);
    if (/^[1-4]$/.test(event.key)) {
      enterUniverse();
      showDossier(Number(event.key) - 1, true);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (Math.max(0, activeIndex) + direction + projects.length) % projects.length;
      enterUniverse();
      showDossier(next, true);
    }
  });

  if (!window.THREE || !canvas) {
    genesis.querySelector("p").firstChild.textContent = "WebGL unavailable — project index active ";
    setTimeout(() => {
      genesis.classList.add("is-complete");
      document.body.classList.add("is-ready", "has-entered");
    }, 600);
    return;
  }

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarsePointer.matches, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarsePointer.matches ? 1.2 : 1.55));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11172f);
  scene.fog = new THREE.FogExp2(0x11172f, .045);
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 80);
  camera.position.set(0, .3, 12);

  const universe = new THREE.Group();
  scene.add(universe);

  const nebula = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    uniforms: { uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "varying vec2 vUv;uniform float uTime;void main(){float a=sin(vUv.x*11.0+uTime*.025)*cos(vUv.y*9.0-uTime*.018);float b=sin((vUv.x+vUv.y)*19.0-uTime*.012);float cloud=smoothstep(-.7,.8,a*.55+b*.32);vec3 c1=vec3(.055,.085,.19);vec3 c2=vec3(.27,.12,.42);vec3 c3=vec3(.06,.30,.31);vec3 color=mix(c1,c2,cloud);color=mix(color,c3,smoothstep(.55,.95,sin(vUv.y*7.0+uTime*.02)));gl_FragColor=vec4(color,.92);}"
  }));
  scene.add(nebula);

  const createStarField = (count, radius, size, color, opacity) => {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const r = radius * (.3 + Math.random() * .7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = r * Math.cos(phi);
      positions[index * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  };
  const nearDust = createStarField(coarsePointer.matches ? 600 : 1300, 18, .025, 0xb7d6ff, .72);
  const colorDust = createStarField(coarsePointer.matches ? 180 : 420, 13, .055, 0xff7db9, .34);
  scene.add(nearDust, colorDust);

  const makeTexture = (project, index) => {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 256;
    const context = textureCanvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, `#${project.secondaryHex.toString(16).padStart(6, "0")}`);
    gradient.addColorStop(.5, `#${project.colorHex.toString(16).padStart(6, "0")}`);
    gradient.addColorStop(1, "#11172f");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
    context.globalCompositeOperation = "screen";
    for (let line = 0; line < 52; line += 1) {
      context.strokeStyle = `rgba(255,255,255,${.025 + Math.random() * .12})`;
      context.lineWidth = 1 + Math.random() * 7;
      context.beginPath();
      const y = Math.random() * 256;
      context.moveTo(0, y);
      for (let x = 0; x <= 512; x += 32) context.lineTo(x, y + Math.sin(x * .018 + line + index) * (8 + index * 3));
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  };

  const planetSystems = [];
  const radii = [3.4, 4.35, 5.25, 6.15];
  const initialAngles = [.55, 2.1, 3.75, 5.35];
  const sizes = [.62, .78, .92, .7];

  projects.forEach((project, index) => {
    const pivot = new THREE.Group();
    pivot.rotation.z = (index - 1.5) * .11;
    universe.add(pivot);

    const holder = new THREE.Group();
    holder.position.set(Math.cos(initialAngles[index]) * radii[index], Math.sin(initialAngles[index]) * radii[index] * .58, (index % 2 ? -1 : .4) - index * .22);
    pivot.add(holder);

    const planet = new THREE.Mesh(new THREE.SphereGeometry(sizes[index], 48, 32), new THREE.MeshStandardMaterial({
      map: makeTexture(project, index),
      color: project.colorHex,
      emissive: project.secondaryHex,
      emissiveIntensity: .28,
      metalness: .18,
      roughness: .58
    }));
    planet.userData.projectIndex = index;
    holder.add(planet);

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(sizes[index] * 1.08, 32, 24), new THREE.MeshBasicMaterial({ color: project.colorHex, transparent: true, opacity: .12, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
    holder.add(atmosphere);

    const wire = new THREE.Mesh(new THREE.SphereGeometry(sizes[index] * 1.16, 14, 10), new THREE.MeshBasicMaterial({ color: project.colorHex, wireframe: true, transparent: true, opacity: .065 }));
    holder.add(wire);

    if (index === 1 || index === 3) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(sizes[index] * 1.55, .018, 8, 96), new THREE.MeshBasicMaterial({ color: project.colorHex, transparent: true, opacity: .54, blending: THREE.AdditiveBlending }));
      ring.rotation.x = 1.15;
      ring.rotation.y = .22;
      holder.add(ring);
    }

    const orbitCurve = new THREE.EllipseCurve(0, 0, radii[index], radii[index] * .58, 0, Math.PI * 2, false, 0);
    const orbitPoints = orbitCurve.getPoints(180).map((point) => new THREE.Vector3(point.x, point.y, holder.position.z));
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitLine = new THREE.LineLoop(orbitGeometry, new THREE.LineBasicMaterial({ color: project.colorHex, transparent: true, opacity: .1 }));
    universe.add(orbitLine);

    const satellites = new THREE.Group();
    for (let satelliteIndex = 0; satelliteIndex < 18; satelliteIndex += 1) {
      const angle = satelliteIndex / 18 * Math.PI * 2;
      const point = new THREE.Mesh(new THREE.SphereGeometry(.012 + Math.random() * .016, 6, 6), new THREE.MeshBasicMaterial({ color: project.colorHex }));
      point.position.set(Math.cos(angle) * sizes[index] * 1.45, Math.sin(angle) * sizes[index] * 1.45, Math.sin(angle * 3) * .16);
      satellites.add(point);
    }
    holder.add(satellites);
    planetSystems.push({ pivot, holder, planet, atmosphere, wire, satellites, project, speed: .000035 + index * .000008 });
  });

  scene.add(new THREE.HemisphereLight(0x9db8ff, 0x211332, 1.6));
  const sun = new THREE.PointLight(0xe8fbff, 72, 28, 1.4);
  sun.position.set(0, 0, 5);
  scene.add(sun);
  const warmLight = new THREE.PointLight(0xff6f9f, 34, 18, 2);
  warmLight.position.set(-7, -4, 3);
  scene.add(warmLight);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  const pointerTarget = new THREE.Vector2();
  const worldPosition = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3(0, .3, 12);
  const desiredLook = new THREE.Vector3();
  const currentLook = new THREE.Vector3();
  let pointerDown = false;
  let dragStartX = 0;
  let dragRotation = 0;
  let targetDragRotation = 0;

  const setPointer = (event) => {
    pointer.x = event.clientX / innerWidth * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
    pointerTarget.x = pointer.x;
    pointerTarget.y = pointer.y;
    coordinateX.textContent = `X ${pointer.x >= 0 ? "+" : ""}${pointer.x.toFixed(2)}`;
    coordinateY.textContent = `Y ${pointer.y >= 0 ? "+" : ""}${pointer.y.toFixed(2)}`;
  };

  canvas.addEventListener("pointermove", (event) => {
    setPointer(event);
    if (pointerDown) targetDragRotation = dragRotation + (event.clientX - dragStartX) * .0025;
  }, { passive: true });
  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    dragStartX = event.clientX;
    dragRotation = targetDragRotation;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointerup", () => { pointerDown = false; });
  canvas.addEventListener("pointerleave", () => {
    pointer.set(9, 9);
    if (lockedIndex < 0) clearDossier();
  });
  canvas.addEventListener("click", () => {
    if (activeIndex >= 0) showDossier(activeIndex, true);
    else enterUniverse();
  });

  const projectMeshes = planetSystems.map((system) => system.planet);
  const updateLabels = () => {
    planetSystems.forEach((system, index) => {
      system.planet.getWorldPosition(worldPosition);
      const projected = worldPosition.clone().project(camera);
      const x = (projected.x * .5 + .5) * innerWidth;
      const y = (-projected.y * .5 + .5) * innerHeight;
      labels[index].style.transform = `translate3d(${x}px, ${y}px, 0) translate(18px, -50%)`;
      labels[index].style.visibility = projected.z > 1 ? "hidden" : "visible";
    });
  };

  let visible = true;
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; });
  const clock = new THREE.Clock();
  const render = (time = 0) => {
    requestAnimationFrame(render);
    if (!visible) return;
    const delta = Math.min(clock.getDelta(), .05);
    nebula.material.uniforms.uTime.value = time * .001;
    universe.rotation.y += (targetDragRotation - universe.rotation.y) * .035;
    universe.rotation.x += ((pointerTarget.y * .035) - universe.rotation.x) * .025;
    nearDust.rotation.y += .00006;
    colorDust.rotation.x -= .000045;

    planetSystems.forEach((system, index) => {
      if (!reducedMotion.matches) system.pivot.rotation.z += system.speed * delta * 60;
      system.planet.rotation.y += (activeIndex === index ? .018 : .0028) * delta * 60;
      system.planet.rotation.x = Math.sin(time * .0003 + index) * .08;
      system.atmosphere.scale.setScalar(1 + Math.sin(time * .001 + index) * .018);
      system.wire.rotation.y -= .0012 * delta * 60;
      system.satellites.rotation.z += (.002 + index * .0004) * delta * 60;
    });

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(projectMeshes, false)[0];
    if (lockedIndex < 0 && hit) {
      const index = hit.object.userData.projectIndex;
      if (activeIndex !== index) {
        enterUniverse();
        showDossier(index);
      }
    } else if (lockedIndex < 0 && !hit && activeIndex >= 0) {
      clearDossier();
    }

    const focusIndex = lockedIndex >= 0 ? lockedIndex : activeIndex;
    if (focusIndex >= 0) {
      planetSystems[focusIndex].planet.getWorldPosition(worldPosition);
      desiredLook.copy(worldPosition);
      desiredCamera.set(worldPosition.x * .44, worldPosition.y * .44, worldPosition.z + (innerWidth < 760 ? 6.2 : 4.4));
    } else {
      desiredLook.set(0, 0, 0);
      desiredCamera.set(pointerTarget.x * .3, .3 + pointerTarget.y * .2, innerWidth < 760 ? 13.5 : 12);
    }
    const cameraEase = reducedMotion.matches ? 1 : Math.min(1, delta * 2.2);
    camera.position.lerp(desiredCamera, cameraEase);
    currentLook.lerp(desiredLook, cameraEase * .9);
    camera.lookAt(currentLook);
    updateLabels();
    renderer.render(scene, camera);
  };

  const resize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.fov = innerWidth < 760 ? 52 : 42;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarsePointer.matches ? 1.2 : 1.55));
    renderer.setSize(innerWidth, innerHeight);
  };
  addEventListener("resize", resize, { passive: true });

  const genesisStarted = performance.now();
  const advanceGenesis = (now) => {
    const progress = Math.min(1, (now - genesisStarted) / 1150);
    genesisValue.textContent = `${Math.floor(progress * 100)}%`;
    if (progress < 1) requestAnimationFrame(advanceGenesis);
    else {
      genesis.classList.add("is-complete");
      document.body.classList.add("is-ready");
    }
  };
  requestAnimationFrame(advanceGenesis);

  render();
})();
