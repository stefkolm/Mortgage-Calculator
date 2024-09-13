import "./App.css"
import { useState } from "react";
import icon from "./icon-calculator.svg"

function UserInputField({format, label, formatLeft, value, change, errors}) {
  const [isFocused, setIsFocused] = useState(false);
  return(
  <>
    <div className="inputContainer">
      <h1 className="inputLabel">{label}</h1>
      <div className={`inputField ${isFocused ? 'active' : ''} ${errors ? "error" : ""}`}>
      {formatLeft ? (
            <>
              <div className={`inputIconContainer ${isFocused ? 'active' : ''} ${errors ? "error" : ""}`}>
                <h1 className="formatText">{format}</h1>
              </div>
              <CurrencyInput value={value} focused={() => setIsFocused(true)} blur={() => setIsFocused(false )} onChange={change}/>
            </>
          ) : (
            <>
              <CurrencyInput value={value} focused={() => setIsFocused(true)} blur={() => setIsFocused(false )} onChange={change}/>
              <div className={`inputIconContainer ${isFocused ? 'active' : ''} ${errors ? "error" : ""}`}>
                <h1 className="formatText">{format}</h1>
              </div>
            </>
          )}
      </div>
      {errors && (<p className="errorText">This field is required</p>)}
    </div>
  </>)
  
}

function CurrencyInput({focused, blur, value, onChange}) {

  return <input className="input" onFocus={focused} onBlur={blur} type="x" value={value} onChange={onChange}></input>;
}

export default function Board() {
  const [mortgageAmount, setMortgageAmount] = useState("");
  const [mortgageTerm, setMortgageTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const formatNumber = (num) =>{
    return new Intl.NumberFormat('en-US').format(num.replace(/\D/g, ""));
  }

  function clearAll() {
    setMortgageAmount("");
    setMortgageTerm("");
    setInterestRate("");
    setSelectedType("");
  }

  const [errors, setErrors] = useState({
    mortgageAmount: false,
    mortgageTerm: false,
    interestRate: false,
    type: false,
  });

  function handleSubmit(){
    const newErrors = {
      mortgageAmount: mortgageAmount === "",
      mortgageTerm: mortgageTerm === "",
      interestRate: interestRate === "",
      type: selectedType === ""
    };
    console.log(newErrors)
    setErrors(newErrors);
  };

  const handleCurrencyChange = (event) => {
    const inputValue = event.target.value;
    const formatedValue = formatNumber(inputValue);
    setMortgageAmount(formatedValue);
  }
  const handleMortage = (event) => {
    const inputValue = event.target.value;
    setMortgageTerm(inputValue);
  }

  const handleRate = (event) => {
    const inputValue = event.target.value;
    setInterestRate(inputValue);
  }

  function handleLabelClick(value) {
    setSelectedType(value); 
  }

  return( 
  <>
    <div className="container">
        <div className="calculatorContainer">
          <div className="userInputContainer">
            <div className="mortageTitleContainer">
              <h1 className="titleText">Mortage Calculator</h1>
              <button onClick={clearAll} className="clearBtn">Clear All</button>
            </div>
            <UserInputField errors={errors.mortgageAmount} change={handleCurrencyChange} value={mortgageAmount} label="Mortage Amount" format="£" formatLeft={true}/>
            <div className="termRateContainer">
              <UserInputField errors={errors.mortgageTerm} change={handleMortage} value={mortgageTerm} label="Mortgage Term" format="years" formatLeft={false}/>
              <UserInputField errors={errors.interestRate} change={handleRate} value={interestRate} label="Interest Rate" format="%" formatLeft={false}/>
            </div>
            <div className="radioContainer">
              <h1 className="inputLabel">Mortgage Type</h1>
              <label className={`selectContainer ${selectedType === "Repayment" ? "selected" : ""}`} onClick={() => handleLabelClick('Repayment')}>
                <input className="radio" type="radio" name="mortgage" value="selectedType" checked={selectedType === 'Repayment'}/>
                <h1>Repayment</h1>
              </label>
              <label className={`selectContainer ${selectedType === "Interest" ? "selected" : ""}`}>
                <input checked={selectedType === 'Interest'} className="radio" type="radio" name="mortgage" value="Interest" onClick={() => handleLabelClick('Interest')}/>
                <h1>Interest Only</h1>
              </label>
              {errors.type && (<p className="errorText">This field is required</p>)}
            </div>
            <button onClick={handleSubmit} className="submitButton">
              <img src={icon} ></img>
              <h1>Calculate Repayments</h1>
            </button>
          </div>
          <div className="outputContainer">

          </div>
        </div>
    </div>
  </>);
}