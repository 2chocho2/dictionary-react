import axios from "axios";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import "./SpellCheck.css";


const SpellCheck = () => {

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
  
    const handlerChangeInput = e => {
      setInput(e.target.value);
    };

    const handlerCheck = e => {
      axios.post('http://localhost:8080/checker', { "sentence": input })
        .then(response => {
            console.log(JSON.parse(response.data[0]));          
            setOutput(JSON.parse(response.data[0]));
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <div className="spell_check_container">
            <div className="spell_check_title_circle">ㄱㄴㄷ</div>
            <h2 className="spell_check_title">맞춤법 검사기</h2>

                <div className="spell_check_original_text" >

                    {/* 제목 원고지 칸 */}
                    <div className="box1">원</div>
                    <div className="box1">문</div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box2"></div>
                    <div className="titleBox">
                        <div className="spell_check_text_title"></div>
                    </div>
                    {/* 제목 원고지 칸 끝 */}

                    <div >
                        <textarea onChange={handlerChangeInput} placeholder="맞춤법 검사를 원하는 단어나 문장을 입력해주세요."></textarea><br/>
                        <button className="spell_check_btn" onClick={handlerCheck}>검사 시작</button>
                    </div>
                </div>

                <div className="spell_check_ResultText">

                    {/* 제목 원고지 칸 */}
                    <div className="box1">교</div>
                    <div className="box1">정</div>
                    <div className="box1"></div>
                    <div className="box1">결</div>
                    <div className="box1">과</div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box1"></div>
                    <div className="box2"></div>
                    <div className="titleBox">
                        <div  className="spell_check_text_title"></div>
                    </div>
                    {/* 제목 원고지 칸 끝 */}

                    <div className="spell_check_ResultText2"> 
                        {output && output.result}
                        {output && output.suggest.map(sgst => 
                            <p>{sgst.info}</p>
                        )}
                    </div>
                    <CopyToClipboard text={output && output.result}>
                        <button className="spell_check_btn">복사하기</button>
                    </CopyToClipboard>
                </div>
        </div>
    );

}
export default SpellCheck;