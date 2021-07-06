import { Tooltip, Typography } from 'antd';
import { formatRelative } from 'date-fns';
import React from 'react';
import styled from 'styled-components';


const Div1Styled = styled.div`
  margin-bottom: 17px;
  margin-left: 9px;
  display: flex;
  width: 99%;
  justify-content:flex-end;

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    overflow-y: visible;
    color: #fff;
    max-width: 400px;
    min-width: 20px;
    word-wrap:break-word;
    font-size: 15px;
    text-align: justify;
  }

  .ant-tooltip-inner{
      magrin-left: '-20px';
  }
`;


const Div3Styled = styled.div`
    max-width: 800px;
    background-color: #0099ff;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 3px 18px 5px 18px;
    magrin-left: 10px;
    min-width: 40px;
    text-align: justify;
`;

function formatDate(seconds) {
    let formattedDate = '';
    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}


function IMessage({ text, createdAt }) {
    return (
        <Div1Styled>
            <Div3Styled>
                <Tooltip placement="left"
                    title={
                        formatDate(createdAt?.seconds)
                    }>
                    <Typography.Text className='content'>
                        {text}</Typography.Text>
                </Tooltip>
            </Div3Styled>
        </Div1Styled>
    );
}

export default IMessage;
