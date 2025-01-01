import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CustomButton } from "@/components/CustomUi";
import { IoMdArrowBack } from "react-icons/io";
import BackgroundPage from "@/components/BackgroundPage";
import { NavBar } from "@/components/NavBar";
import CustomSelect from "@/components/register/CustomSelect";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  validateEmail,
  validateName,
  validateRequiredFieldsStep1,
  validateRequiredFieldsStep2,
} from "@/utils/validateRegisterStep1";
import ProfilePicturesForm from "@/components/register/ProfilePicturesForm";

function RegisterPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [citys, setCitys] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sexualIdentities, setSexualIdentities] = useState("");
  const [racialPreferences, setRacialPreferences] = useState("");
  const [meetingInterests, setMeetingInterests] = useState("");
  const [sexualPreferences, setSexualPreferences] = useState("");
  const [racialIdentities, setRacialIdentities] = useState("");
  const [aboutme, setAboutme] = useState("");
  const [hobbies, sethobbies] = useState("");
  const router = useRouter();
  const [preferencesOptions, setPreferencesOptions] = useState([]);
  const [meetingOptions, setMeetingOptions] = useState([]);
  const [racialOptions, setRacialOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");
        console.log("API Response:", response.data);

        const genderOptions = response.data.genders.rows.map((item) => ({
          value: item.gender_id.toString(),
          label: item.gender_name,
        }));
        setPreferencesOptions(genderOptions);

        const meetingInterestOptions = response.data.meeting_interest.rows.map(
          (item) => ({
            value: item.meeting_interest_id.toString(),
            label: item.meeting_name,
          }),
        );
        setMeetingOptions(meetingInterestOptions);

        const racialOptions = response.data.racial_identity.rows.map(
          (item) => ({
            value: item.racial_id.toString(),
            label: item.racial_name,
          }),
        );
        setRacialOptions(racialOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");
        console.log("API Response:", response.data);
        setLocations(
          response.data.location.map((loc) => ({
            value: loc.location_id.toString(),
            label: loc.location_name,
          })),
        );

        setAllCities(response.data.city);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const filteredCities = allCities.filter(
        (city) => city.location_id.toString() === selectedLocation,
      );
      setCities(filteredCities);
    } else {
      setCities([]);
    }
  }, [selectedLocation, allCities]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [avatar, setAvatars] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("selectedLocation", selectedLocation);
    formData.append("citys", citys);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm", confirm);
    formData.append("sexualIdentities", sexualIdentities);
    formData.append("sexualPreferences", sexualPreferences);
    formData.append("racialPreferences", racialPreferences);
    formData.append("meetingInterests", meetingInterests);
    formData.append("hobbies", JSON.stringify(hobbies));
    formData.append("aboutme", aboutme);
    formData.append("racialIdentities", racialIdentities);

    for (let avatarKey in avatar) {
      formData.append("avatar", avatar[avatarKey]);
    }
    register(formData);
  };

  const updateHobbies = (selectedOptions) => {
    sethobbies(selectedOptions);
  };
  console.log("updateHobbies", updateHobbies);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAvatars = { ...avatar };

    files.forEach((file, index) => {
      const uniqueId = Date.now() + index;
      if (Object.keys(newAvatars).length < 5) {
        newAvatars[uniqueId] = file;
      }
    });

    setAvatars(newAvatars);
  };
  const handleRemoveImage = (event, avatarKey) => {
    event.preventDefault();
    const updatedAvatars = { ...avatar };
    delete updatedAvatars[avatarKey];
    setAvatars(updatedAvatars);
  };

  const handleInputChange = (event) => {
    setAboutme("");
    setAboutme(event.target.value);
  };

  const [step, setStep] = useState(1);
  const goToPrevStep = (e) => {
    e.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      const requiredErrorStep1 = validateRequiredFieldsStep1({
        name,
        date,
        selectedLocation,
        citys,
        username,
        email,
      });
      if (requiredErrorStep1) {
        alert(requiredErrorStep1);
        return;
      }
      const nameError = validateName(name);
      if (nameError) {
        alert(nameError);
        return;
      }
      const emailError = validateEmail(email);
      if (emailError) {
        alert(emailError);
        return;
      }
      if (password !== confirm) {
        alert("Password และ Confirm Password ไม่ตรงกัน!");
        return;
      }
    }
    if (step === 2) {
      const requiredErrorStep2 = validateRequiredFieldsStep2({
        sexualIdentities,
        sexualPreferences,
        racialIdentities,
        racialPreferences,
        meetingInterests,
        hobbies,
        aboutme,
      });
      if (requiredErrorStep2) {
        alert(requiredErrorStep2);
        return;
      }
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <NavBar />
      <BackgroundPage className="flex items-center justify-center bg-utility-bgMain">
        <div className="container mt-10 flex min-h-screen flex-col justify-start lg:mt-36">
          <div className="">
            <div className="container ml-2 flex-grow">
              {" "}
              <div className="lg:flex lg:h-[145px] lg:w-full lg:items-center lg:justify-center lg:px-8">
                {/* Header */}
                <div className="">
                  <div className="lg:head lg:mr-8 lg:h-[145px] lg:w-[453px] lg:text-left">
                    <h2 className="font-nunito text-[14px] font-semibold">
                      Register
                    </h2>
                    <h1 className="items-center font-nunito text-[32px] font-extrabold text-second-500 lg:text-[46px]">
                      Join us and start matching
                    </h1>
                  </div>
                </div>

                {/* Step Indicator นับตัวเลยหน้าใช้.map */}
                <div className="mt-2 flex justify-center gap-[16px] px-4 lg:h-[80px] lg:w-[430px] lg:px-0">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`tab relative flex h-auto w-auto items-center justify-start rounded-[8px] border-[1px] lg:tab lg:relative lg:h-[80px] lg:gap-[8px] lg:rounded-[16px] ${
                        step === num ? "border-second-500" : "border-gray-200"
                      } transform transition-all duration-300 ease-in-out ${
                        step === num ? "scale-105" : "scale-100"
                      }`}
                    >
                      {/* หมายเลข (1, 2, 3) อยู่ตรงกลางด้านซ้าย */}
                      <span
                        className={`mt-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-fourth-200 text-center font-nunito text-[16px] font-bold leading-[30px] tracking-[-2%] text-second-500 lg:mt-0 lg:h-[50px] lg:w-[50px] lg:space-x-[12px] lg:text-[24px] ${
                          step === num
                            ? "bg-fourth-200 text-second-500"
                            : "bg-gray-200 text-gray-500"
                        } ml-0 transition-all duration-300 ease-in-out`}
                      >
                        {num}
                      </span>

                      {/* Step และข้อความที่เกี่ยวข้องจะอยู่ทางขวา */}
                      {step === num && (
                        <div className="transition-all duration-300 ease-in-out lg:ml-auto">
                          <h2 className="text-left font-nunito font-medium lg:text-[12px] lg:leading-[18px]">
                            Step {num}/3
                          </h2>
                          {num === 1 && (
                            <div className="flex w-full items-center justify-between">
                              <h1 className="text-center font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
                                Basic Information
                              </h1>
                            </div>
                          )}
                          {num === 2 && (
                            <h1 className="font-nunito text-[12px] font-extrabold text-second-500 lg:text-[12px] lg:leading-[24px]">
                              Identities and Interests
                            </h1>
                          )}
                          {num === 3 && (
                            <h1 className="font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
                              Upload Photos
                            </h1>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Content */}

            <div className="mt-8 flex flex-col">
              <div className="container flex-grow px-4">
                <div className="container">
                  {step === 1 && (
                    <div className="grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
                      <label className="form-control">
                        <span className="label-text">Name</span>
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value);
                          }}
                          className="input input-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                          placeholder="Name"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Date of Birth</span>
                        <input
                          type="date"
                          name="date"
                          value={date}
                          onChange={(event) => {
                            setDate(event.target.value);
                          }}
                          className="input input-bordered h-[48px] appearance-none rounded-[8px] border-[1px] bg-white dark:bg-white"
                          max={getCurrentDate()} // ใช้วันที่ปัจจุบันเป็นค่าของ max
                        />
                      </label>

                      <label className="form-control">
                        <span className="label-text">Location</span>
                        <select
                          name="location"
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="select select-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                        >
                          <option value="" disabled>
                            Select Location
                          </option>
                          {locations.map((loc) => (
                            <option key={loc.value} value={loc.value}>
                              {loc.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="form-control">
                        <span className="label-text">City</span>
                        <select
                          name="city"
                          value={citys}
                          onChange={(e) => setCitys(e.target.value)}
                          disabled={!selectedLocation} // ถ้าไม่มีการเลือก location ให้ disabled
                          className="select select-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                        >
                          <option value="" disabled>
                            Select City
                          </option>
                          {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="form-control">
                        <span className="label-text">Username</span>
                        <input
                          type="text"
                          name="username"
                          value={username}
                          onChange={(event) => {
                            setUsername(event.target.value);
                          }}
                          className="input input-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                          placeholder="Username"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Email</span>
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                          className="input input-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                          placeholder="Email"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Password</span>
                        <input
                          type="password"
                          name="password"
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                          className="input input-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                          placeholder="Password"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Confirm Password</span>
                        <input
                          type="password"
                          name="confirm"
                          value={confirm}
                          onChange={(event) => {
                            setConfirm(event.target.value);
                          }}
                          className="input input-bordered h-[48px] rounded-[8px] border-[1px] bg-white dark:bg-white"
                          placeholder="Confirm Password"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="">
                  {step === 2 && (
                    <div className="">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="form-control">
                          <span className="label-text">Sexual identities</span>
                          <select
                            className="select select-bordered bg-white"
                            name="sexualIdentities"
                            value={sexualIdentities}
                            onChange={(event) => {
                              setSexualIdentities(event.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Sexual Identity
                            </option>{" "}
                            {preferencesOptions.map((gender) => (
                              <option key={gender.value} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="form-control">
                          <span className="label-text">Sexual preferences</span>
                          <select
                            className="select select-bordered bg-white"
                            name="sexualPreferences"
                            value={sexualPreferences}
                            onChange={(event) => {
                              setSexualPreferences(event.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Sexual Preference
                            </option>
                            {/* แสดงข้อมูล gender จาก API */}
                            {preferencesOptions.map((gender) => (
                              <option key={gender.value} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="form-control">
                          <span className="label-text">Racial identities</span>
                          <select
                            className="select select-bordered bg-white"
                            name="racialPreferences"
                            value={racialIdentities}
                            onChange={(event) => {
                              setRacialIdentities(event.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Racial Preference
                            </option>{" "}
                            {/* แสดงข้อมูล gender จาก API */}
                            {racialOptions.map((racialOptions) => (
                              <option
                                key={racialOptions.value}
                                value={racialOptions.value}
                              >
                                {racialOptions.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="form-control">
                          <span className="label-text">Racial preferences</span>
                          <select
                            className="select select-bordered bg-white"
                            name="racialPreferences"
                            value={racialPreferences}
                            onChange={(event) => {
                              setRacialPreferences(event.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Racial Preference
                            </option>{" "}
                            {/* แสดงข้อมูล gender จาก API */}
                            {racialOptions.map((racialOptions) => (
                              <option
                                key={racialOptions.value}
                                value={racialOptions.value}
                              >
                                {racialOptions.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="form-control">
                          <span className="label-text">Meeting Interests</span>
                          <select
                            className="select select-bordered bg-white"
                            value={meetingInterests}
                            onChange={(event) => {
                              setMeetingInterests(event.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Meeting Interest
                            </option>
                            {/* แสดงข้อมูล meetingInterests */}
                            {meetingOptions.map((meetingOptions) => (
                              <option
                                key={meetingOptions.value}
                                value={meetingOptions.value}
                              >
                                {meetingOptions.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-6">
                        <CustomSelect
                          formData={hobbies}
                          updateHobbies={updateHobbies}
                        />
                      </div>
                      <div>
                        <label className="about-me-section mt-6 flex w-full flex-col gap-1">
                          <span className="text-base font-normal text-utility-second">
                            About me (Maximum 150 characters)
                          </span>
                          <input
                            type="text"
                            placeholder="Write something about yourself"
                            className="h-28 w-full rounded-[8px] border bg-white px-4 pb-14 placeholder-fourth-900 dark:bg-white"
                            name="aboutme"
                            value={aboutme}
                            onChange={handleInputChange} // ใช้ฟังก์ชันที่กำหนดเพื่ออัปเดตค่า
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {step === 3 && (
                    <div className="mr-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex">
                      <ProfilePicturesForm
                        avatar={avatar}
                        handleFileChange={handleFileChange}
                        handleRemoveImage={handleRemoveImage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Navigation */}
      </BackgroundPage>
      <footer className="flex h-[112px] flex-shrink-0 items-center justify-between border-t border-gray-300 bg-white">
        <div className="ml-10 lg:ml-96">
          <span>{step}/3</span>
        </div>
        <div className="mr-10 flex space-x-4 lg:mr-80">
          <button
            disabled={step === 1}
            onClick={goToPrevStep}
            className="flex h-[48px] w-[80px] items-center justify-center rounded-full border-2 text-primary-500"
          >
            <IoMdArrowBack className="mr-2" />
            Back
          </button>
          <CustomButton
            className="w-[80px]"
            buttonType="primary"
            onClick={step < 3 ? goToNextStep : handleSubmit}
          >
            {step < 3 ? "Next Step" : "Submit"}
          </CustomButton>
        </div>
      </footer>
    </>
  );
}

export default RegisterPage;
