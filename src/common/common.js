import styled from "styled-components"

export const StyledContainer = styled.div`
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const StyledMessageWrapper = styled.div`
  width: 100%;
  font-size: 1rem;
  text-align: center;
`

export const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  background-color: #02D87E;
  color: white;
`;

export const Column = styled.div`
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

export const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const GoogleKMSTitle = styled.div`
  margin-left: 0.5rem;
  transform: translateY(4px);
  font-weight: 400;
  font-size: 2rem;
  text-decoration: none;
  color: #2a2825;
`

export const GoogleKmsImage = styled.img`
  height: 4rem;
`;

export const Text = styled.div`
  margin-top: 1rem;
  min-height: 3rem;
  text-align: center;
`;

export const Error = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  min-height: 3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: left;
  color: white;
  background-color: #FC4C2E;
  box-sizing: border-box;
`;

export const Message = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

export const TextCenter = styled.div`
  text-align: center;
`

export const HorizontalLine = styled.hr`
  color: white;
  border: 1px solid white;
`