import "./App.css"
import { useState } from "react";
import icon from "./icon-calculator.svg"
import illustration from "./illustration-empty.svg"
import { motion, useAnimation } from "framer-motion";

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
  const [monthly, setMonthly] = useState(0);
  const [total, setTotal] = useState(0);
  const controls = useAnimation();
  const result = useAnimation();

  const calculateMortgage = (amount, years, interestRate, type) => {
    amount = parseFloat(amount.replace(/,/g, ''));
    const P = parseFloat(amount);
    interestRate = parseFloat(interestRate);
    const annualInterestRateDecimal = parseFloat(interestRate) / 100;
    const r = annualInterestRateDecimal / 12; // Monthly interest rate
    const n = parseFloat(years) * 12; // Total number of payments


    if (type === "repayment") {
      const M = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      return M.toFixed(2); // round to 2 decimal places
    } else if (type === "interest-only") {
      const interestOnlyMonthly = P * r; // Use monthly interest rate
      return `${interestOnlyMonthly.toFixed(2)}`; // round to 2 decimal places
    } else {
      return "Invalid mortgage type.";
    }
  };

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
    setErrors(newErrors);
    const mothlyResult = calculateMortgage(mortgageAmount, mortgageTerm, interestRate, selectedType);
    setMonthly(mothlyResult);
    setTotal(formatNumber(String(mothlyResult * mortgageTerm * 12)));
    controls.start({
      y: -100, // Example animation: fade in
      opacity: 0,
      transition: { duration: 0.25 }, // 0.5s transition
    });
    result.start({
      y: 0, // Example animation: fade in
      opacity: 100,
      transition: { duration: 0.25 }, // 0.5s transition
      visibility:"visible"
    });
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
              <h1 className="titleText">Mortgage Calculator</h1>
              <button onClick={clearAll} className="clearBtn">Clear All</button>
            </div>
            <UserInputField errors={errors.mortgageAmount} change={handleCurrencyChange} value={mortgageAmount} label="Mortgage Amount" format="£" formatLeft={true}/>
            <div className="termRateContainer">
              <UserInputField errors={errors.mortgageTerm} change={handleMortage} value={mortgageTerm} label="Mortgage Term" format="years" formatLeft={false}/>
              <UserInputField errors={errors.interestRate} change={handleRate} value={interestRate} label="Interest Rate" format="%" formatLeft={false}/>
            </div>
            <div className="radioContainer">
              <h1 className="inputLabel">Mortgage Type</h1>
              <label className={`selectContainer ${selectedType === "repayment" ? "selected" : ""}`} onClick={() => handleLabelClick('repayment')}>
                <input className="radio" type="radio" name="mortgage" value="repayment" checked={selectedType === 'repayment'}/>
                <h1>Repayment</h1>
              </label>
              <label className={`selectContainer ${selectedType === "interest-only" ? "selected" : ""}`}>
                <input checked={selectedType === 'interest-only'} className="radio" type="radio" name="mortgage" value="interest-only" onClick={() => handleLabelClick('interest-only')}/>
                <h1>Interest Only</h1>
              </label>
              {errors.type && (<p className="errorText">This field is required</p>)}
            </div>
            <div className="inputContainer">
              <button onClick={handleSubmit} className="submitButton">
                <img alt="icon" src={icon} ></img>
                <h1>Calculate Repayments</h1>
              </button>
            </div>
          </div>
          <div className="outputContainer">
            <motion.div animate={controls} initial={{ y:0, opacity:100}} className="outputPreview">
              <img alt="illustration" src={illustration}></img>
              <h1>Results shown here</h1>
              <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
            </motion.div>
            <motion.div animate={result} initial={{ y:100, opacity:0, visibility: "hidden"}} className="resultPreview">
              <h1>Your results</h1>
              <p>Your results are shown below based on the information you provided. To adjust 
                the results, edit the form and click "calculate repayments" again.
              </p>
              <div className="resultContainer">
                <div className="result">
                  <div className="monthlyContainer">
                    <p>Your monthly repayments</p>
                    <h1>£{monthly}</h1>
                  </div>
                  <div className="totalContainer">
                    <p>Total you'll repay over the term</p>
                    <h1>£{total}</h1>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    </div>
  </>);
}