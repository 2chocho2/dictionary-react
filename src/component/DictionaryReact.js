import { useEffect, useState} from 'react';
import './Vector.png'
import axios from 'axios';
import './DictionaryReact.css';

function DictionaryReact() {

    const [dictionary, setDictionary] = useState([]);
    const [input, setInput] = useState('');
    const [wordName, setWordName] = useState('');
    const [wordContent, setWordContent] = useState('');
    const [wordList, setWordList] = useState([]); // 단어장에 추가된 단어 리스트
    const [datas, setDatas] = useState([]);

    // 단어장 목록
    const updateLocalStorageAndState = (newWordList) => {
        localStorage.setItem('wordList', JSON.stringify(newWordList));
        setWordList(newWordList);
      };
      
    // 단어장에 추가
    const handleAddWord = (word) => {
        if (wordList.some((w) => w.title === word.title)) {
          alert('이미 단어장에 추가된 단어입니다.');
          return;
        }
      
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api`, { wordName, wordContent })
          .then((response) => {
            const newWordList = [
              ...wordList,
              { ...word, wordIdx: response.data },
            ];
            updateLocalStorageAndState(newWordList);
            alert('단어장에 추가되었습니다.');
          })
          .catch((error) => {
            console.log(error);
            alert('단어장 추가에 실패했습니다.');
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
              })
              .catch(error => {
                console.log(error);
                alert('단어장 삭제에 실패했습니다.');
              });
          } else {
            alert('wordIdx가 없습니다.');
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

    const fetchData = async (keyword) => {
        try {
            
            console.log(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/dictionary/${keyword}`);

            const response = await axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/dictionary/${keyword}`);

            console.log(response);


            setDictionary(response.data.items);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect 훅 내부
    useEffect(() => {
        const storedWordList = localStorage.getItem('wordList');
            if (storedWordList) {
                setWordList(JSON.parse(storedWordList));
            }
  
    fetchData(input);
  
    axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/word`)
      .then(response => {
        console.log(response);
        setDatas(response.data);
      })
  }, [])
  

    return (
        <>
            <div className="top">
                <div className="circle"></div>
                <div className="title">슬기로운 회사생활</div>
            </div>
            <div className="search">
                <input className="input1" type="text" onChange={handlerChangeInput} value={wordName}></input>
                <button className="btn" onClick={handlerSearch}></button>
            </div>
            <div className="boxA">
            <div className="dictionary">DICTIONARY FOR WORKER</div>
            <div className="word_list_title">나의 단어장</div>
            </div>
            <div className="boxB">
            <div className="result">
                {dictionary.map((word) => (
                    <div key={word.link}>
                        <div className="result_word">
                            <button className="add_btn" onClick={() => handleAddWord(word)}></button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href={word.link} target="_blank" rel="noreferrer" dangerouslySetInnerHTML={{ __html: word.title }}></a>
                        </div>
                        <div className="result_content" dangerouslySetInnerHTML={{ __html: word.description }}>
                        </div>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </div>

                ))}
            </div>    
           <div className="word_list">
                    {wordList.map((word) => (
                    <div key={word.link}>
                        <a href={word.link} target="_blank" rel="noreferrer">
                            <div className="color"></div>
                            <div className="word_title" dangerouslySetInnerHTML={{ __html: word.title }}></div>
                        </a>
                        <button className="dlt_btn" onClick={() => handleDeleteWord(word)}></button>
                    </div>
                    ))}
                </div>
                </div>
        </>
    )
}


export default DictionaryReact;
