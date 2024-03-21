"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(Array(2).fill(null));
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const storedTime = localStorage.getItem("timeRemaining");
    if (storedTime) {
      setTimeRemaining(parseInt(storedTime, 10));
    } else {
      const initialTime = 133; // 2 minutes and 13 seconds in seconds
      setTimeRemaining(initialTime);
      localStorage.setItem("timeRemaining", initialTime.toString());
    }
  }, []);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem("timeRemaining", newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctOption: "Paris",
    },
    {
      question: "What is the capital of Germany?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctOption: "Berlin",
    },
  ];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOptionChange = (questionIndex, optionValue) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[questionIndex] = optionValue;
    setSelectedOptions(updatedOptions);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prevQuestion) =>
      prevQuestion > 0 ? prevQuestion - 1 : prevQuestion
    );
  };

  const handleNext = () => {
    setCurrentQuestion((prevQuestion) =>
      prevQuestion < questions.length - 1 ? prevQuestion + 1 : prevQuestion
    );
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    selectedOptions.forEach((option, index) => {
      if (option === questions[index].correctOption) {
        correctAnswers++;
      }
    });
    const percentage = (correctAnswers / questions.length) * 100;
    return percentage.toFixed(0);
  };

  const handleFinish = () => {
    setShowScore(true);
  };

  if (showScore) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold">
          Your score: {calculateScore()}%
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="container flex flex-1 flex-col gap-4 px-4 md:px-6">
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 flex-shrink-0" />
            <div className="text-sm font-medium">Time remaining</div>
            <div className="font-medium">{formatTime(timeRemaining)}</div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {questions[currentQuestion].question}
            </h1>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 items-start gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label
                    className="flex items-center"
                    htmlFor={`option${index + 1}`}
                  >
                    <Input
                      className="mr-2"
                      id={`option${index + 1}`}
                      name="option"
                      type="radio"
                      value={option}
                      checked={selectedOptions[currentQuestion] === option}
                      onChange={() =>
                        handleOptionChange(currentQuestion, option)
                      }
                    />
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-end">
          {currentQuestion > 0 && (
            <Button size="sm" variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <Button size="sm" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={handleFinish}>
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
