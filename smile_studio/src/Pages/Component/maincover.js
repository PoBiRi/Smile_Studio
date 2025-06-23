import SmileLogo from './smilelogo';
import { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';
import SmileLogoShadow from './smilelogoshadow';

function MainCover() {
    const [scrollY, setScrollY] = useState(() => parseFloat(localStorage.getItem("scrollY")) || 0);
    const [circleSize, setCircleSize] = useState(() => parseFloat(localStorage.getItem("circleSize")) || 0);
    const [logoUpDown, setLogoUpDown] = useState(() => parseFloat(localStorage.getItem("logoUpDown")) || -12);
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
            const minScroll = 1500;
            const maxScroll = 3000;

            // 현재 스크롤 위치를 정규화 (0 ~ 1 사이 값)
            let progress = Math.max(0, Math.min((scrollY - minScroll) / (maxScroll - minScroll), 1));

            // 이징 처리: 느리게 시작해서 빠르게 증가
            const easedProgress = progress ** 2;

            // 화면 너비 또는 높이 기준으로 최대 크기 계산
            const maxSize = (scrollY > 3000 ? 5 : 2) * Math.max(window.innerWidth, window.innerHeight);
            const newSize = easedProgress * maxSize;

            setCircleSize(newSize);
            localStorage.setItem("circleSize", newSize);
        };

        const updateLeft = () => {
            const minSize = 0;
            const maxSize = window.innerWidth * 0.55;
            const minLeft = 50;
            const maxLeft = 55.9;

            const t = Math.max(0, Math.min((circleSize - minSize) / (maxSize - minSize), 1));
            const interpolated = maxLeft - (maxLeft - minLeft) * t;

            setCircleLeft(interpolated);
            localStorage.setItem("circleLeft", interpolated);
        }

        const updateCirclePosition = () => {
            if (circleRef.current) {
                const rect = circleRef.current.getBoundingClientRect();
                const circleCenterX = rect.left + rect.width / 2;
                const circleCenterY = rect.top + rect.height / 2;
                setCirclePosition({ x: circleCenterX, y: circleCenterY });
                localStorage.setItem("circlePosition", JSON.stringify({ x: circleCenterX, y: circleCenterY }));
            }
        };

        const updateLogoUpDown = () => {
            const minScroll = 3000;
            const maxScroll = 4000;
            if (scrollY >= minScroll && maxScroll <= 4000) {
                // 스크롤이 최소에서 최대 사이일 때
                const normalizedScroll = (scrollY - minScroll) / (maxScroll - minScroll); // 0에서 1 사이로 정규화
                const interpolatedY = -12 + ((-78 - (-12)) * normalizedScroll); // -12%에서 -50%로 보간
                setLogoUpDown(interpolatedY);
            } else if (scrollY < minScroll) {
                // 스크롤이 최소 미만일 때
                setLogoUpDown(-12);
            } else {
                // 스크롤이 최대 초과일 때
                setLogoUpDown(-78);
            }
        }

        updateCircleSize();
        updateLeft();
        updateCirclePosition();
        updateLogoUpDown();

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
                <LogoWrapper
                    style={{
                        transform: `translate(-50%, ${logoUpDown}%)`,
                    }}    
                >
                    <SmileLogo/>
                    <Shadow 
                        circleSize={circleSize} 
                        circleLeft={circleLeft}
                    >
                        <SmileLogoShadow/>
                    </Shadow>
                    
                    <Circle
                        ref={circleRef}
                        style={{
                            width: circleSize-1,
                            height: circleSize-1,
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

const LogoWrapper = styled(motion.div)`
    position: relative;
    left: 50%;
    top: 50%;
    width: 90%;
    aspect-ratio: 732.05 / 1314.73;
    transform: translate(-50%, -12%);
`;

const SidebarLeft = styled.div`
    width: 20%;
    background-color:rgb(238, 120, 105);
    position: relative;
    
    /* clip-path을 이용해 원과 겹친 부분을 잘라냄 */
    clip-path: ${(props) =>
        props.circleSize >= 0
            ? `circle(${props.circleSize / 2 + 1}px at ${props.circlePosition.x}px ${props.circlePosition.y}px)`
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
    top: 6.1%;
    background-color: transparent;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: solid rgba(238, 120, 105, 0.7);
    z-index: 3;
`;

const Shadow = styled.div`
    width: 100%;
    height: 100%;
    clip-path: ${(props) =>
        props.circleSize >= 0
            ? `circle(${props.circleSize / 2}px at ${props.circleLeft}% ${6.1}%)`
            : 'none'};
`

export default MainCover;