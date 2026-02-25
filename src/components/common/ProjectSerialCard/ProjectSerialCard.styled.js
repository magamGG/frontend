import styled from 'styled-components';

/** 담당자/에이전시 카드와 동일 스타일: 프로젝트명, 작가, 플랫폼, N일 연재, 마감 */
export const Card = styled.div`
  padding: 20px;
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: ${(p) => (p.$onClick ? 'pointer' : 'default')};
  transition: all 0.2s;

  &:hover {
    ${(p) =>
      p.$onClick
        ? `
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: var(--accent);
    transform: translateY(-2px);
    `
        : ''}
  }
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ThumbnailWrap = styled.div`
  flex-shrink: 0;
`;

export const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const Genre = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  flex-wrap: wrap;
`;

export const MetaGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
`;

export const MetaDivider = styled.span`
  color: var(--muted-foreground);
`;

export const StatusWrap = styled.div`
  flex-shrink: 0;
  width: 78px;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 768px) {
    text-align: left;
    align-items: flex-start;
    width: 100%;
  }
`;

export const DeadlineText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: left;
  margin: 0;
`;
