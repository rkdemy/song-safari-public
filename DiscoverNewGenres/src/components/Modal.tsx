import React, { useState } from "react";
import modalStyles from "./styling/Modal.module.css";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ children }) => {
  const [result, setResult] = React.useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_FORM);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully. Visit us tomorrow");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div>
      <div>
        <div onClick={openModal}>{children}</div>
        {isModalOpen && (
          <div className={modalStyles.modal}>
            <div className={modalStyles.overlay} onClick={closeModal}></div>
            <div className={modalStyles.modal_content}>
              <div className={modalStyles.close_modal}>
                <p>Contact Me</p>

                <IoCloseOutline
                  onClick={closeModal}
                  className={modalStyles.close}
                />
              </div>

              <p id={modalStyles.text}>
                Please send the email and name used for your spotify account.
                I'll add you to the allowlist.
              </p>

              <form onSubmit={onSubmit}>
                <div className={modalStyles.input_container}>
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" required />
                </div>
                <div className={modalStyles.input_container}>
                  <label htmlFor="name">Name</label>
                  <input name="name" type="text" required />
                </div>
                <div className={modalStyles.input_container}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    name="message"
                    maxLength={150}
                    placeholder="Optional"
                  />
                </div>
                <div className={modalStyles.submit_container}>
                  <button type="submit" className={modalStyles.submit}>
                    Send
                  </button>
                  <span>{result}</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
