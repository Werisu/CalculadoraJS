/**
 * Dentro de uma classe, se encontram variáveis e funções
 * Variáveis: sõa recursos que armazenam informação
 * Funções: são códigos que executam uma função e retornam um valor
 * 
 * Atributos e Métodos
 */

class CalcController {

    /* Método construtor */
    constructor() {

        this._lastOperator = "";
        this._lastNumber = "";

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        /* 
            Em vem de var,
            usamos this para criar um atributo e não uma variável.
            o comando interno this referencia atributos e métodos.

            O processo de encapsulamento controla
            o acesso de um atributo ou método
            privado: _nomedoastributo
            this._displayCalc = "0";
            this._currentDate;
        */

        this._currentDate;
        this.initialize();

        this.initButtonsEvents();
        this.initkeyboard();
    }

    copyToClipboard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            console.log(text);
        });

    }

    initialize() {

        /* 
         *    DOM = Modelo de Objetos do Documento, estrutura
         *    em que se baseia o domento HTML
         */

        this.setDisplayDateTime();

        // Arraw fuction
        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

    }


    // evento de teclado
    initkeyboard() {

        document.addEventListener('keyup', e => {
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry()
                    break;
                case '+':

                case '-':

                case '*':

                case '/':

                case '%':

                    this.addOperator(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperator(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) {
                        this.copyToClipboard();
                    }
                    break;
            }
        });

    }

    addEventListenerAll(element, events, fn) {

        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });

    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry() {

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    }

    isOperator(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc();

            console.log(this._operation);

        }
    }

    getResult() {

        try {

            return eval(this._operation.join(""));

        } catch (error) {

            setTimeout(() => {
                this.setError();
            }, 1);

        }
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();

        if (last == "%") {

            result /= 100;

            this._operation = [result, last];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperator(value) {

        if (isNaN(this.getLastOperation())) {
            //String true

            if (this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value);

            } else if (isNaN(value)) {
                //Outra coisa
                console.log("Outra coisa");
            } else {
                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }

        } else {
            //Number false

            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }

        //this.displayCalc = this._operation.join("");

    }

    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry()
                break;
            case 'soma':
                this.addOperator("+");
                break;
            case 'subtracao':
                this.addOperator("-");
                break;
            case 'divisao':
                this.addOperator("/");
                break;
            case 'multiplicacao':
                this.addOperator("*");
                break;
            case 'porcento':
                this.addOperator("%");
                break;
            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperator(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {

        // "#buttons > g" peque todas as tags g que são filhos de id=buttons 
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        /* diferença entre querySelector e querySelectorAll é que esse ultimo
        vai trazer todos os elementos
        */

        // forEach para percorrer todos os elementos selecionados
        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click drag', e => {

                let txtBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(txtBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            });

        });

    }

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    /* Os métodos Getters e Setters permitem definir como acessar os valores */

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(valor) {

        if (valor.toString.length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = valor;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(valor) {
        this._currentDate = valor;
    }

}