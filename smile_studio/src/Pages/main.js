import styled from "styled-components";
import MainCover from "./Component/maincover";

function Main() {
  return (
    <Container>
        {/*<ToPath />*/}
        <MainCover/>
    </Container>
  );
}

const Container = styled.div`
  height: ${4200 + window.innerHeight}px; /* 스크롤을 유도하기 위해 화면을 길게 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Main;