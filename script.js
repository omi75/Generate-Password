const inputSlider=document.querySelector('[data-slider]')
const lengthDisplay=document.querySelector('[dataLenNumber]')
const passwordDisplay = document.querySelector("[passDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passLength=10;
let checkCount = 0;
// set pass legnth
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passLength;
    lengthDisplay.innerText = passLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passLength - min)*100/(max - min)) + "% 100%";
};
// set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer
let getRandInt=(min,max)=>{
    return Math.floor(Math.random()*(max-min))+min;
};

// get random number
let generateRandNumber=()=>{
    return getRandInt(0,9);
};

// get random lowercase

let generateLowerCase=()=>{
    return String.fromCharCode(getRandInt(97,123));
};

// get random uppercase

let generateUpperCase=()=>{
    return String.fromCharCode(getRandInt(65,91));
};

// get Random symbol
let generateSymbol=()=>{
    let Num = getRandInt(0,symbols.length);
    return symbols.charAt(Num);
};

// calculate strength
let calculateStrength=()=>{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  

    if (hasUpper && hasLower && (hasNum || hasSym) && passLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
};

// copying clipboard content
let copyContent=async()=>{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }
    // make copy message visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
};

// adding listner to slider
inputSlider.addEventListener("input",(event)=>{
    passLength=event.target.value;
    handleSlider();
});

// adding listner to copy button
copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
});

// handling check count
function handleChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passLength < checkCount ) {
        passLength = checkCount;
        handleSlider();
    }
};

// adding listner to checkboxes
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleChange());
});

//  shuffle password

let shufflePass=(arr)=>{
    //Fisher Yates Method
    for (let i = arr.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach((el) => (str += el));
    return str;
};


// adding listner to generate button
generateBtn.addEventListener("click",()=>{
    if(checkCount <  0)
        return;
    //special condition
    if(passLength < checkCount ) 
    {
        passLength = checkCount;
        handleSlider();
    }
    // old pass
    password="";

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // adding pass to password variable
    for(let i=0;i<funcArr.length;i++)
    {
        password+=funcArr[i]();
    }
    // comabining remaining data
    for(let i=0;i<passLength-funcArr.length;i++)
    {
        let randomIndex=getRandInt(0,funcArr.length);
        try
        {
            password+=funcArr[randomIndex]();
        }
        catch(e){console.log(e)}
    }
    // shuffle the password
    password=shufflePass(Array.from(password));     // converting string to array

    // displaying password
    passwordDisplay.value=password;
    // calculate strength
    calculateStrength();
});