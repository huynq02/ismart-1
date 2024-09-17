import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Warehouse3D = () => {
    const mountRef = useRef(null);
    const [inputs, setInputs] = useState({ length: 0, width: 0 });
    const [dimensions, setDimensions] = useState(null);
    const [shelfCount, setShelfCount] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleSubmit = () => {
        setDimensions(inputs);
    };

    useEffect(() => {
        if (!dimensions) return;

        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0xf0f0f0);
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        const calculateShelves = (length, width, shelfLength, shelfWidth, aisleWidth) => {
            const numShelvesLength = Math.max(0, Math.floor((length - aisleWidth) / (shelfLength + aisleWidth)));
            const numShelvesWidth = Math.max(0, Math.floor((width - aisleWidth) / (shelfWidth + aisleWidth)));
            return { numShelvesLength, numShelvesWidth };
        };

        const { length, width } = dimensions;
        const height = 10;
        const shelfLength = 2;
        const shelfWidth = 1;
        const shelfHeight = 2;
        const aisleWidth = 1.5;

        const { numShelvesLength, numShelvesWidth } = calculateShelves(length, width, shelfLength, shelfWidth, aisleWidth);

        setShelfCount(numShelvesLength * numShelvesWidth);

        const shelfMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
        });
        const shelfEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

        const shelfGeometry = new THREE.BoxGeometry(shelfLength, shelfHeight, shelfWidth);
        const edgesGeometry = new THREE.EdgesGeometry(shelfGeometry);

        for (let i = 0; i < numShelvesLength; i++) {
            for (let j = 0; j < numShelvesWidth; j++) {
                const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
                shelf.position.set(
                    -length / 2 + shelfLength / 2 + aisleWidth + i * (shelfLength + aisleWidth),
                    shelfHeight / 2,
                    -width / 2 + shelfWidth / 2 + aisleWidth + j * (shelfWidth + aisleWidth)
                );
                scene.add(shelf);

                const shelfEdges = new THREE.LineSegments(edgesGeometry, shelfEdgeMaterial);
                shelfEdges.position.copy(shelf.position);
                scene.add(shelfEdges);
            }
        }

        // Create custom grid
        const createGrid = (length, width, step) => {
            const grid = new THREE.Group();
            const material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });

            for (let i = -length / 2; i <= length / 2; i += step) {
                const points = [];
                points.push(new THREE.Vector3(i, 0, -width / 2));
                points.push(new THREE.Vector3(i, 0, width / 2));
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                grid.add(line);
            }

            for (let j = -width / 2; j <= width / 2; j += step) {
                const points = [];
                points.push(new THREE.Vector3(-length / 2, 0, j));
                points.push(new THREE.Vector3(length / 2, 0, j));
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                grid.add(line);
            }

            return grid;
        };

        const grid = createGrid(length, width, 1);
        scene.add(grid);

        camera.position.set(length / 2, height / 2, Math.max(length, width));

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [dimensions]);

    return (
        <div>
            <div>
                <h2 style={{ color: '#3b3bf5', marginTop: '20px', marginLeft: '20px' }}>Tạo kho 3D</h2>

            </div>
            <div style={styles.container}>


                <div style={styles.formContainer}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Length (meters):</label>
                        <input
                            type="number"
                            name="length"
                            value={inputs.length}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Width (meters):</label>
                        <input
                            type="number"
                            name="width"
                            value={inputs.width}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <button onClick={handleSubmit} style={styles.button}>Submit</button>
                    {dimensions && (
                        <div style={styles.shelfCount}>
                            <p>Số kệ mà bạn có thể thêm vào kho với diện tích bạn có:</p>
                            <p style={styles.countNumber}>{shelfCount}</p>
                        </div>
                    )}

                    <div style={styles.description}>
                        <h3>Hướng dẫn sử dụng:</h3>
                        <p>Nhập độ dài và chiều rộng của kho của bạn vào các vị trí bên trên.</p>
                        <p>Bấm vào nút "Submit" để xem số lượng kệ có thể thêm vào, ứng với diện tích kho của bạn.</p>
                        <p>Ứng dụng này sẽ tính toán tự động và hiển thị số lượng kệ có thể thêm vào kho của bạn.</p>
                    </div>
                </div>
                <div ref={mountRef} style={styles.scene} />
            </div>
        </div>

    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '20px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        width: 'fit-content',
        marginRight: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10px',
    },
    label: {
        width: '150px',
        marginRight: '10px',
    },
    input: {
        padding: '5px',
        borderRadius: '3px',
        border: '1px solid #ccc',
        flex: '1',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    scene: {
        width: '1000px',
        height: '600px',
    },
    shelfCount: {
        marginTop: '20px',
        textAlign: 'left',
        backgroundColor: '#e0f7fa',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
    },
    countNumber: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#007bff',
        margin: '5px 0 0 0',
    },
    description: {
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
};

export default Warehouse3D;
