import { useEffect, useState } from 'react';
import './Vector.png'
import axios from 'axios';
import './DictionaryReact.css';
import { TiDocumentAdd } from "react-icons/ti";
import { RiCloseCircleLine } from "react-icons/ri";
import styled from "styled-components";
import img1 from "./img/word1.png";
import img2 from "./img/word2.png";
import img3 from "./img/word3.png";
import img4 from "./img/word4.png";
import img5 from "./img/word5.png";
import img6 from "./img/word6.png";

function DictionaryReact1() {

  const [dictionary, setDictionary] = useState([]);
  const [input, setInput] = useState('');
  const [wordName, setWordName] = useState('');
  const [wordContent, setWordContent] = useState('');
  const [wordList, setWordList] = useState([]);
  const [datas, setDatas] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  // 나의 단어장 인덱스 색상
  const wordImgArr = [img1, img2, img3, img4, img5, img6];

  const wordListWithImages = wordList.map((word, index) => {
    const backgroundImg = wordImgArr[index % wordImgArr.length];
    return { ...word, backgroundImg };
  });

  const MyWordImg = styled.div`
  background-image: url(${props => props.backgroundImg});
  background-size: contain;
  background-repeat: no-repeat;
  `;

  // 단어장 목록
  const updateLocalStorageAndState = (newWordList) => {
    localStorage.setItem('wordList', JSON.stringify(newWordList));
    setWordList(newWordList);
  };

  // 단어장에 추가
  const handleAddWord = (word) => {
    if (wordList.some((w) => w.title === word.title)) {
      setAlertMessage('이미 단어장에 추가된 단어입니다.');
      return;
    }

    axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/add/word`, { wordName, wordContent })
      .then((response) => {
        const newWordList = [
          ...wordList,
          { ...word, wordIdx: response.data },
        ];
        updateLocalStorageAndState(newWordList);
        setAlertMessage('단어장에 추가되었습니다.');
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage('단어장 추가에 실패했습니다.');
      });
  };

  // 단어장에서 단어 삭제
  const handleDeleteWord = (word) => {
    const newWordList = wordList.filter((w) => w.wordIdx !== word.wordIdx);
    updateLocalStorageAndState(newWordList);

    try {
      if (word.wordIdx) {
        axios.delete(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/word/${word.wordIdx}`)
          .then(response => {
            updateLocalStorageAndState(newWordList);
            setAlertMessage('단어장에서 단어를 삭제했습니다.');
          })
          .catch(error => {
            console.log(error);
            setAlertMessage('단어장 삭제에 실패했습니다.');
          });
      } else {
        setAlertMessage('wordIdx가 없습니다.');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlerChangeInput = (e) => {
    setInput(e.target.value);
    setWordName(e.target.value);
  };

  const handlerSearch = async (e) => {
    fetchData(input);
  };

  // 엔터로 검색
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handlerSearch();
    }
  };

  const fetchData = async (keyword) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/dictionary/${keyword}`);
      setDictionary(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedWordList = localStorage.getItem('wordList');
    if (storedWordList) {
      setWordList(JSON.parse(storedWordList));
    }

    fetchData(input);

    axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/word`)
      .then(response => {
        setDatas(response.data);
      })
  }, [])

  // 알림창 닫기
  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  return (
    <>
      <div id="my-contianer">
        <div className='header-container'>
          <div className="search">
            <input className="input1"
              type="text"
              onChange={handlerChangeInput}
              onKeyPress={handleKeyPress}
              value={wordName}></input>
            <button className="btn"
              onClick={handlerSearch}></button>
          </div>
        </div>

        <div className="body-container">
          <div className='dictionary-container'>
            <div className='dictionary-box'>
              <div className="dictionary">DICTIONARY FOR WORKER</div>
              <table width="100%" className='word-list'>
                <colgroup>
                  <col width="20%" />
                  <col width="1%" />
                  <col width="*" />
                </colgroup>
                <tbody>
                  {dictionary.length > 0
                    ?
                    dictionary.map((word) => (
                      <tr key={word.link}>
                        <td className="result_word">
                          <TiDocumentAdd className="add_btn" onClick={() => handleAddWord(word)} />
                          <div><a href={word.link} target="_blank" rel="noreferrer" dangerouslySetInnerHTML={{ __html: word.title }}></a></div>
                        </td>
                        <td></td>
                        <td>
                          <p className="result_content" dangerouslySetInnerHTML={{ __html: word.description }}></p>
                        </td>
                      </tr>
                    ))
                    : Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        <td className="result_word"></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className='my-word-container'>
            <div className="word_list_title">나의 단어장</div>
            <div className="my-word_list">
              <div className='my-word_list-box'>
                {
                  wordList.map((word, index) => {
                    const backgroundImg = wordImgArr[index % wordImgArr.length];
                    return (
                      <div className="my-words" key={word.link}>
                        <div className="my-word-contents">
                          <a href={word.link} target="_blank" rel="noreferrer">
                            <div className="word_title" dangerouslySetInnerHTML={{ __html: word.title }}></div>
                          </a>
                          <RiCloseCircleLine className="dlt_btn" onClick={() => handleDeleteWord(word)} />
                        </div>
                        <MyWordImg className="color" backgroundImg={backgroundImg} />
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {alertMessage && (
        <div className="alert">
          <div className="alert-content">
            {alertMessage}
          </div>
          <button className="close-btn" onClick={handleCloseAlert}>
            확인
          </button>
        </div>
      )}

    </>
  );
}

export default DictionaryReact1;
