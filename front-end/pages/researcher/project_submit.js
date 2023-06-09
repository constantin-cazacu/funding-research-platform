// ProjectSubmit component
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import BasicSection from '../../components/BasicSection';
import BudgetSection from '../../components/BudgetSection';
import TimelineSection from '../../components/TimelineSection';
import { Box, Button } from '@mui/material';
import CoOwnerMailField from '../../components/CoOwnerMailField';
import FundingGoalInput from '../../components/FundingGoal';

function ProjectSubmit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectTitle: '',
    selectedFields: [],
    abstract: '',
    fundingGoal: '',
    currency: '',
    studentEmail: '',
    supervisorEmail: '',
    budgetItems: {},
    timelineItems: [],
  });
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!loggedIn || role !== 'researcher') {
      router.push('/401'); // Navigate to 401 page if not logged in or not a researcher
    }
  }, [loggedIn, role, router]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!loggedIn || role !== 'researcher') {
      router.push('/401'); // Navigate to 401 page if not logged in or not a researcher
      return;
    }

    // Send the form data to the backend
    console.log('Project data submitted:', formData); // just for testing purposes

    // Check if budget is empty
    if (Object.keys(formData.budgetItems).length === 0) {
      console.log('Budget is empty');
    } else {
      console.log('Budget is not empty');
    }

    fetch('http://localhost:5000/researcher/submit_project', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the request header
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response);
        // Handle response from the API
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  const handleInputChange = (event) => {
    const target = event.target;
    if (!target) {
      return;
    }
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // console.log(name, value); // add this line to check the values

    if (!name) {
      return;
    }

    if (name === 'selectedFields') {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    } else if (name === 'budgetItems') {
      const updatedBudgetItems = { ...formData.budgetItems };
      updatedBudgetItems[target.id][target.name] = value;
      setFormData((formData) => ({
        ...formData,
        budgetItems: updatedBudgetItems,
      }));
      handleBudgetChange(updatedBudgetItems);
    } else if (name === 'fundingGoal' || name === 'currency') {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    } else if (name === 'supervisorEmail') {
      setFormData((formData) => ({
        ...formData,
        supervisorEmail: value,
      }));
    } else if (name === 'studentEmail') {
      setFormData((formData) => ({
        ...formData,
        studentEmail: value,
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    }
  };

  const handleFieldSelectionChange = (selectedFields) => {
    setFormData((formData) => ({
      ...formData,
      selectedFields: selectedFields,
    }));
  };

  const handleBudgetChange = (newBudgetItems) => {
    setFormData((formData) => ({
      ...formData,
      budgetItems: newBudgetItems,
    }));
  };

  const handleTimelineItemsChange = (timelineItems) => {
    setFormData((formData) => ({
      ...formData,
      timelineItems: timelineItems,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <BasicSection
            handleInputChange={handleInputChange}
            handleFieldSelectionChange={handleFieldSelectionChange}
            setFormData={setFormData} />
        <FundingGoalInput
            handleInputChange={handleInputChange} />
        <CoOwnerMailField
            handleInputChange={handleInputChange} />
        <BudgetSection
            handleInputChange={handleInputChange}
            handleBudgetChange={handleBudgetChange}
            formData={formData}
            setFormData={setFormData} />
        <TimelineSection
            handleInputChange={handleInputChange}
            onTimelineItemsChange={handleTimelineItemsChange} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 3 }}>
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
}

export default ProjectSubmit;
