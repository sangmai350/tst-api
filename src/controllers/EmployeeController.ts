
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Employee } from "../entity/Employee";

class EmployeeController {

  static listAll = async (req: Request, res: Response) => {
    //Get employees from database
    const employeeRepository = getRepository(Employee);
    const _employees = await employeeRepository.find({
      select: ["id", "name", "dob", "address", "phone", "salary", "joinDate"]
    });

    //Send the employees object
    res.send(_employees);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the employee from database
    const employeeRepository = getRepository(Employee);
    try {
      const _employee = await employeeRepository.findOneOrFail(id, {
        select: ["id", "name", "dob", "address", "phone", "salary", "joinDate"]
      });
      res.send(_employee);
    } catch (error) {
      res.status(404).send("Employee not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, dob, address, phone, joinDate, salary } = req.body;
    let _employee = new Employee();
    _employee.name = name;
    _employee.dob = dob;
    _employee.address = address;
    _employee.phone = phone;
    _employee.salary = salary;
    _employee.joinDate = joinDate;

    //Validade if the parameters are ok
    const errors = await validate(_employee);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }


    //Try to save. If fails, the username is already in use
    const employeeRepository = getRepository(Employee);
    try {
      await employeeRepository.save(_employee);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({ id: _employee.id });
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    let { name, dob, address, phone, joinDate, salary } = req.body;

    //Try to find user on database
    const employeeRepository = getRepository(Employee);
    let _employee: Employee;
    try {
      _employee = await employeeRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Employee not found");
      return;
    }

    //Validate the new values on model
    _employee.name = name;
    _employee.dob = dob;
    _employee.address = address;
    _employee.phone = phone;
    _employee.salary = salary;
    _employee.joinDate = joinDate;
    const errors = await validate(_employee);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await employeeRepository.save(_employee);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const employeeRepository = getRepository(Employee);
    let _employee: Employee;
    try {
      _employee = await employeeRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Employee not found");
      return;
    }
    employeeRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default EmployeeController;
