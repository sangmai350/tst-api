
import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

class EmployeeController {

  public static listAllEmployees = async (req: Request, res: Response) => {
    // Get employees from database
    const employeeRepository = getRepository(Employee);
    const employees = await employeeRepository.find({
      select: ["id", "name", "dob", "address", "phone", "salary", "isActive", "joinDate"],
    });
    const sumSalary = await getRepository(Employee).createQueryBuilder("employee")
      .select("SUM(employee.salary)", "value")
      .where("employee.isActive = :isActive", { isActive: true }).getRawOne();

    // Send the employees object
    res.send({ Employee: employees, TotalSalary: sumSalary });
  }

  public static getOneEmployeeById = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id: string = req.params.id;

    // Get the employee from database
    const employeeRepository = getRepository(Employee);
    try {
      const employee = await employeeRepository.findOneOrFail(id, {
        select: ["id", "name", "dob", "address", "phone", "salary", "isActive", "joinDate"],
      });
      res.send(employee);
    } catch (error) {
      res.status(404).send("Employee not found");
    }
  }

  public static newEmployee = async (req: Request, res: Response) => {
    // Get parameters from the body
    const { name, dob, address, phone, joinDate, salary, isActive } = req.body;
    const employee = new Employee();
    employee.name = name;
    employee.dob = dob;
    employee.address = address;
    employee.phone = phone;
    employee.salary = salary;
    employee.joinDate = joinDate;
    employee.isActive = isActive;

    // Validade if the parameters are ok
    const errors = await validate(employee);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to save. If fails, the username is already in use
    const employeeRepository = getRepository(Employee);
    try {
      await employeeRepository.save(employee);
    } catch (e) {
      res.status(409).send("Please check your params: " + e);
      return;
    }

    // If all ok, send 201 response
    res.status(201).send({ id: employee.id });
  }

  public static editEmployee = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { name, dob, address, phone, joinDate, salary, isActive } = req.body;

    // Try to find user on database
    const employeeRepository = getRepository(Employee);
    let employee: Employee;
    try {
      employee = await employeeRepository.findOneOrFail(id);
    } catch (error) {
      // If not found, send a 404 response
      res.status(404).send("Employee not found");
      return;
    }

    // Validate the new values on model
    employee.name = name;
    employee.dob = dob;
    employee.address = address;
    employee.phone = phone;
    employee.salary = salary;
    employee.joinDate = joinDate;
    employee.isActive = isActive;
    const errors = await validate(employee);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to safe, if fails, that means username already in use
    try {
      await employeeRepository.save(employee);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }
    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  }

  public static deleteEmployee = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    const employeeRepository = getRepository(Employee);
    let employee: Employee;
    try {
      employee = await employeeRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Employee not found");
      return;
    }
    employeeRepository.delete(id);

    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  }
}

export default EmployeeController;
