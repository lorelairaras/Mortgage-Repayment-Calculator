document.addEventListener("DOMContentLoaded", function () {
  const clearBtn = document.getElementById("clearBtn");
  const calculateBtn = document.getElementById("calculateBtn");
  const mortgageAmount = document.getElementById("mortgageAmount");
  const mortgageTerm = document.getElementById("mortgageTerm");
  const interestRate = document.getElementById("interestRate");
  const mortgageType = document.getElementsByName("mortgageType");
  const amountError = document.getElementById("amountError");
  const termError = document.getElementById("termError");
  const rateError = document.getElementById("rateError");
  const typeError = document.getElementById("typeError");
  const emptyResults = document.getElementById("emptyResults");
  const completedResults = document.getElementById("completedResults");
  const monthlyRepayment = document.getElementById("monthlyRepayment");
  const totalRepayment = document.getElementById("totalRepayment");
  const srAnnouncement = document.getElementById("srAnnouncement");

  clearBtn.addEventListener("click", function () {
    mortgageAmount.value = "";
    mortgageTerm.value = "";
    interestRate.value = "";
    mortgageType.forEach((radio) => (radio.checked = false));

    amountError.classList.add("hidden");
    termError.classList.add("hidden");
    rateError.classList.add("hidden");
    typeError.classList.add("hidden");

    emptyResults.classList.remove("hidden");
    completedResults.classList.add("hidden");

    mortgageAmount.classList.remove("border-red");
    mortgageTerm.classList.remove("border-red");
    interestRate.classList.remove("border-red");

    srAnnouncement.textContent = "Form cleared";
  });

  calculateBtn.addEventListener("click", function () {
    let isValid = true;

    if (!mortgageAmount.value || mortgageAmount.value <= 0) {
      amountError.classList.remove("hidden");
      mortgageAmount.classList.add("border-red");
      isValid = false;
    } else {
      amountError.classList.add("hidden");
      mortgageAmount.classList.remove("border-red");
    }

    if (!mortgageTerm.value || mortgageTerm.value <= 0) {
      termError.classList.remove("hidden");
      mortgageTerm.classList.add("border-red");
      isValid = false;
    } else {
      termError.classList.add("hidden");
      mortgageTerm.classList.remove("border-red");
    }

    if (!interestRate.value || interestRate.value <= 0) {
      rateError.classList.remove("hidden");
      interestRate.classList.add("border-red");
      isValid = false;
    } else {
      rateError.classList.add("hidden");
      interestRate.classList.remove("border-red");
    }

    const isTypeSelected = Array.from(mortgageType).some((radio) => radio.checked);
    if (!isTypeSelected) {
      typeError.classList.remove("hidden");
      isValid = false;
    } else {
      typeError.classList.add("hidden");
    }

    if (isValid) {
      const principal = parseFloat(mortgageAmount.value);
      const years = parseFloat(mortgageTerm.value);
      const annualRate = parseFloat(interestRate.value) / 100;
      const months = years * 12;
      const monthlyRate = annualRate / 12;

      let monthlyPayment = 0;
      let totalPayment = 0;

      const selectedType = Array.from(mortgageType).find((radio) => radio.checked).value;

      if (selectedType === "repayment") {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        totalPayment = monthlyPayment * months;
      } else {
        monthlyPayment = principal * monthlyRate;
        totalPayment = monthlyPayment * months + principal;
      }

      monthlyRepayment.textContent = `£${monthlyPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
      totalRepayment.textContent = `£${totalPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;

      emptyResults.classList.add("hidden");
      completedResults.classList.remove("hidden");

      srAnnouncement.textContent = `Calculation complete. Monthly repayment: ${monthlyRepayment.textContent}, Total repayment: ${totalRepayment.textContent}`;
    } else {
      srAnnouncement.textContent = "Form validation failed. Please check all required fields.";
    }
  });

  mortgageAmount.addEventListener("input", function () {
    if (this.value && this.value > 0) {
      amountError.classList.add("hidden");
      this.classList.remove("border-red");
    }
  });

  mortgageTerm.addEventListener("input", function () {
    if (this.value && this.value > 0) {
      termError.classList.add("hidden");
      this.classList.remove("border-red");
    }
  });

  interestRate.addEventListener("input", function () {
    if (this.value && this.value > 0) {
      rateError.classList.add("hidden");
      this.classList.remove("border-red");
    }
  });

  mortgageType.forEach((radio) => {
    radio.addEventListener("change", function () {
      typeError.classList.add("hidden");
    });
  });
});
