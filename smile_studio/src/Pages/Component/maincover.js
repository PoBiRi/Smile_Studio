import SmileLogo from './smilelogo';
import { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';
import SmileLogoShadow from './smilelogoshadow';

function MainCover() {
    const [scrollY, setScrollY] = useState(() => parseFloat(localStorage.getItem("scrollY")) || 0);
    const [circleSize, setCircleSize] = useState(() => parseFloat(localStorage.getItem("circleSize")) || 0);
    //const [borderWidth, setBorderWidth] = useState(15);
    const [circleLeft, setCircleLeft] = useState(() => parseFloat(localStorage.getItem("circleLeft")) || 59.1);
    const [circlePosition, setCirclePosition] = useState(() => JSON.parse(localStorage.getItem("circlePosition")) || { x: 0, y: 0 });
    const circleRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            localStorage.setItem("scrollY", window.scrollY);
        };

        const handleResize = () => {
            // 창 크기 변경 시, circleSize와 circlePosition 업데이트
            updateCircleSize();
            updateCirclePosition();
        };

        const updateCircleSize = () => {
            const scale = Math.max(0, Math.min((scrollY - 1400) / 1000, 3));
            setCircleSize(scale * 1000);
            localStorage.setItem("circleSize", scale * 1000);
        };

        const updateCirclePosition = () => {
            if (circleRef.current) {
                const rect = circleRef.current.getBoundingClientRect();
                const circleCenterX = rect.left + rect.width / 2;
                const circleCenterY = rect.top + rect.height / 2;
                setCirclePosition({ x: circleCenterX, y: circleCenterY });
                localStorage.setItem("circlePosition", JSON.stringify({ x: circleCenterX, y: circleCenterY }));
            }
        };

        const updateLeft =() => {
            setCircleLeft(Math.max(Math.min(65 - circleSize * 0.015, 59.1), 50));
            localStorage.setItem("circleLeft", Math.max(Math.min(65 - circleSize * 0.015, 59.1), 50));
        }

        updateCircleSize();
        updateCirclePosition();
        updateLeft();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [scrollY]);

    const borderWidth = Math.min(circleSize * 0.03, 30);
    //const circleLeft = Math.max(Math.min(65 - circleSize * 0.015, 59.1), 50);

    return (
        <Container>
            <SidebarLeft 
                circleSize={circleSize} 
                circlePosition={circlePosition} 
            />
            <Center>
                <LogoWrapper>
                    <SmileLogo/>
                    <Shadow 
                        circleSize={circleSize} 
                        circleLeft={circleLeft}>
                        <SmileLogoShadow/>
                    </Shadow>
                    
                    <Circle
                        ref={circleRef}
                        style={{
                            width: circleSize,
                            height: circleSize,
                            borderWidth: borderWidth,
                            left: `${circleLeft}%`,
                        }}
                    />
                </LogoWrapper>
            </Center>
            <SidebarRight
                circleSize={circleSize} 
                circlePosition={circlePosition} 
            />
        </Container>
    );
};

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    background-color:rgb(0, 0, 0);
`;

const Center = styled.div`
    width: 60%;
    background-color:rgb(252, 255, 226);
`;

const LogoWrapper = styled.div`
    position: relative;
    top: 30%;
    left: 50%;
    width: 60%;
    aspect-ratio: 165 / 100;
    transform: translate(-50%, -50%);
`;

const SidebarLeft = styled.div`
    width: 20%;
    background-color:rgb(238, 120, 105);
    position: relative;
    
    /* clip-path을 이용해 원과 겹친 부분을 잘라냄 */
    clip-path: ${(props) =>
        props.circleSize >= 0
            ? `circle(${props.circleSize / 2}px at ${props.circlePosition.x}px ${props.circlePosition.y}px)`
            : 'none'};
`;

const SidebarRight = styled.div`
    width: 20%;
    background-color:rgb(238, 120, 105);
    position: relative;
    
    /* clip-path을 이용해 원과 겹친 부분을 잘라냄 */
    clip-path: ${(props) =>
        props.circleSize >= 0
            ? `circle(${props.circleSize / 2 + 1}px at ${props.circlePosition.x - window.innerWidth * 0.8}px ${props.circlePosition.y}px)`
            : 'none'};
`;

const Circle = styled(motion.div)`
    position: absolute;
    top: 31%;
    background-color: transparent;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: solid rgba(238, 120, 105, 0.7);
    z-index: 3;
`;

const Shadow = styled.div`
    clip-path: ${(props) =>
        props.circleSize >= 0
            ? `circle(${props.circleSize / 2 + 1}px at ${props.circleLeft}% ${31}%)`
            : 'none'};
`

export default MainCover;