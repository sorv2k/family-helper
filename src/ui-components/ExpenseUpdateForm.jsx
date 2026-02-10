/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getExpense } from "../graphql/queries";
import { updateExpense } from "../graphql/mutations";
const client = generateClient();
export default function ExpenseUpdateForm(props) {
  const {
    id: idProp,
    expense: expenseModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    amount: "",
    category: "",
    notes: "",
    date: "",
    status: "",
    receiptImageKey: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [category, setCategory] = React.useState(initialValues.category);
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [date, setDate] = React.useState(initialValues.date);
  const [status, setStatus] = React.useState(initialValues.status);
  const [receiptImageKey, setReceiptImageKey] = React.useState(
    initialValues.receiptImageKey
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = expenseRecord
      ? { ...initialValues, ...expenseRecord }
      : initialValues;
    setName(cleanValues.name);
    setAmount(cleanValues.amount);
    setCategory(cleanValues.category);
    setNotes(cleanValues.notes);
    setDate(cleanValues.date);
    setStatus(cleanValues.status);
    setReceiptImageKey(cleanValues.receiptImageKey);
    setErrors({});
  };
  const [expenseRecord, setExpenseRecord] = React.useState(expenseModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getExpense.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getExpense
        : expenseModelProp;
      setExpenseRecord(record);
    };
    queryData();
  }, [idProp, expenseModelProp]);
  React.useEffect(resetStateValues, [expenseRecord]);
  const validations = {
    name: [{ type: "Required" }],
    amount: [{ type: "Required" }],
    category: [{ type: "Required" }],
    notes: [],
    date: [{ type: "Required" }],
    status: [{ type: "Required" }],
    receiptImageKey: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          amount,
          category,
          notes: notes ?? null,
          date,
          status,
          receiptImageKey: receiptImageKey ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateExpense.replaceAll("__typename", ""),
            variables: {
              input: {
                id: expenseRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ExpenseUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              amount,
              category,
              notes,
              date,
              status,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Amount"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              amount: value,
              category,
              notes,
              date,
              status,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.amount ?? value;
          }
          if (errors.amount?.hasError) {
            runValidationTasks("amount", value);
          }
          setAmount(value);
        }}
        onBlur={() => runValidationTasks("amount", amount)}
        errorMessage={errors.amount?.errorMessage}
        hasError={errors.amount?.hasError}
        {...getOverrideProps(overrides, "amount")}
      ></TextField>
      <TextField
        label="Category"
        isRequired={true}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              amount,
              category: value,
              notes,
              date,
              status,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.category ?? value;
          }
          if (errors.category?.hasError) {
            runValidationTasks("category", value);
          }
          setCategory(value);
        }}
        onBlur={() => runValidationTasks("category", category)}
        errorMessage={errors.category?.errorMessage}
        hasError={errors.category?.hasError}
        {...getOverrideProps(overrides, "category")}
      ></TextField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              amount,
              category,
              notes: value,
              date,
              status,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
      ></TextField>
      <TextField
        label="Date"
        isRequired={true}
        isReadOnly={false}
        type="date"
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              amount,
              category,
              notes,
              date: value,
              status,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={true}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              amount,
              category,
              notes,
              date,
              status: value,
              receiptImageKey,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Receipt image key"
        isRequired={false}
        isReadOnly={false}
        value={receiptImageKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              amount,
              category,
              notes,
              date,
              status,
              receiptImageKey: value,
            };
            const result = onChange(modelFields);
            value = result?.receiptImageKey ?? value;
          }
          if (errors.receiptImageKey?.hasError) {
            runValidationTasks("receiptImageKey", value);
          }
          setReceiptImageKey(value);
        }}
        onBlur={() => runValidationTasks("receiptImageKey", receiptImageKey)}
        errorMessage={errors.receiptImageKey?.errorMessage}
        hasError={errors.receiptImageKey?.hasError}
        {...getOverrideProps(overrides, "receiptImageKey")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || expenseModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || expenseModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
