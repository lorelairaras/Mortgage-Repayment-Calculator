document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const mortgageAmount = document.getElementById("mortgageAmount");
  const mortgageTerm = document.getElementById("mortgageTerm");
  const interestRate = document.getElementById("interestRate");
  const mortgageType = document.getElementsByName("mortgageType");
  const calculateBtn = document.getElementById("calculateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const emptyResults = document.getElementById("emptyResults");
  const completedResults = document.getElementById("completedResults");
  const monthlyRepayment = document.getElementById("monthlyRepayment");
  const totalRepayment = document.getElementById("totalRepayment");
  const srAnnouncement = document.getElementById("srAnnouncement");

  // Error messages
  const amountError = document.getElementById("amountError");
  const termError = document.getElementById("termError");
  const rateError = document.getElementById("rateError");
  const typeError = document.getElementById("typeError");

  // Event Listeners
  calculateBtn.addEventListener("click", calculateMortgage);
  clearBtn.addEventListener("click", clearForm);

  // Add keyboard event listeners for accessibility
  document.addEventListener("keydown", function (e) {
    // Submit form on Enter key when focused on inputs
    if (e.key === "Enter" && (e.target.tagName === "INPUT" || e.target === calculateBtn)) {
      calculateMortgage();
    }

    // Clear form on Escape key
    if (e.key === "Escape") {
      clearForm();
    }
  });

  // Calculate mortgage function
  function calculateMortgage() {
    // Reset error states
    resetErrors();

    // Validate form
    let isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Get form values
    const amount = parseFloat(mortgageAmount.value);
    const term = parseInt(mortgageTerm.value);
    const rate = parseFloat(interestRate.value);
    const type = getSelectedMortgageType();

    // Calculate mortgage
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    let monthlyPayment;
    let totalPayment;

    if (type === "repayment") {
      // Repayment mortgage calculation
      monthlyPayment = (amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      totalPayment = monthlyPayment * numberOfPayments;
    } else {
      // Interest-only mortgage calculation
      monthlyPayment = amount * monthlyRate;
      totalPayment = monthlyPayment * numberOfPayments + amount;
    }

    // Format and display results
    monthlyRepayment.textContent = formatCurrency(monthlyPayment);
    totalRepayment.textContent = formatCurrency(totalPayment);

    // Show results
    emptyResults.classList.add("hidden");
    completedResults.classList.remove("hidden");

    // Announce results for screen readers
    announceResults(monthlyPayment, totalPayment);
  }

  // Validate form function
  function validateForm() {
    let isValid = true;

    // Validate mortgage amount
    if (!mortgageAmount.value || parseFloat(mortgageAmount.value) <= 0) {
      amountError.classList.remove("hidden");
      mortgageAmount.classList.add("border-red");
      isValid = false;
    }

    // Validate mortgage term
    if (!mortgageTerm.value || parseInt(mortgageTerm.value) <= 0) {
      termError.classList.remove("hidden");
      mortgageTerm.classList.add("border-red");
      isValid = false;
    }

    // Validate interest rate
    if (!interestRate.value || parseFloat(interestRate.value) <= 0) {
      rateError.classList.remove("hidden");
      interestRate.classList.add("border-red");
      isValid = false;
    }

    // Validate mortgage type
    if (!getSelectedMortgageType()) {
      typeError.classList.remove("hidden");
      isValid = false;
    }

    return isValid;
  }

  // Reset errors function
  function resetErrors() {
    amountError.classList.add("hidden");
    termError.classList.add("hidden");
    rateError.classList.add("hidden");
    typeError.classList.add("hidden");

    mortgageAmount.classList.remove("border-red");
    mortgageTerm.classList.remove("border-red");
    interestRate.classList.remove("border-red");
  }

  // Get selected mortgage type
  function getSelectedMortgageType() {
    for (let i = 0; i < mortgageType.length; i++) {
      if (mortgageType[i].checked) {
        return mortgageType[i].value;
      }
    }
    return null;
  }

  // Format currency function
  function formatCurrency(amount) {
    return (
      "£" +
      amount.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  // Clear form function
  function clearForm() {
    mortgageAmount.value = "";
    mortgageTerm.value = "";
    interestRate.value = "";

    // Clear radio buttons
    for (let i = 0; i < mortgageType.length; i++) {
      mortgageType[i].checked = false;
    }

    // Reset errors
    resetErrors();

    // Show empty results
    emptyResults.classList.remove("hidden");
    completedResults.classList.add("hidden");

    // Focus on first input for accessibility
    mortgageAmount.focus();
  }

  // Announce results for screen readers
  function announceResults(monthly, total) {
    const monthlyText = formatCurrency(monthly);
    const totalText = formatCurrency(total);

    srAnnouncement.textContent = `Your monthly repayments are ${monthlyText}. Total you'll repay over the term is ${totalText}.`;

    // Clear the announcement after a short delay
    setTimeout(() => {
      srAnnouncement.textContent = "";
    }, 1000);
  }
});
