
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Income } from "../entity/InOutcome";

class IncomeController {

  static listAll = async (req: Request, res: Response) => {
    //Get Incomes from database
    const incomesRepository = getRepository(Income);
    const _incomes = await incomesRepository.find({
      select: ["id", "date", "value", "description", "personInCharge"]
    });

    //Send the Incomes object
    res.send(_incomes);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the Incomes from database
    const incomeRepository = getRepository(Income);
    try {
      const _income = await incomeRepository.findOneOrFail(id, {
        select: ["id", "date", "value", "description", "personInCharge"]
      });
      res.send(_income);
    } catch (error) {
      res.status(404).send("Incomes not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { date, value, description, personInCharge } = req.body;
    let _income = new Income();
    _income.date = date;
    _income.value = value;
    _income.description = description;
    _income.personInCharge = personInCharge;

    //Validade if the parameters are ok
    const errors = await validate(_income);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }


    //Try to save. If fails, check your params
    const incomeRepository = getRepository(Income);
    try {
      await incomeRepository.save(_income);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({ id: _income.id });
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    let { date, value, description, personInCharge } = req.body;

    //Try to find Incomes on database
    const incomeRepository = getRepository(Income);
    let _income: Income;
    try {
      _income = await incomeRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Incomes not found");
      return;
    }

    //Validate the new values on model
    _income.date = date;
    _income.value = value;
    _income.description = description;
    _income.personInCharge = personInCharge;

    const errors = await validate(_income);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, check your params
    try {
      await incomeRepository.save(_income);
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

    const incomeRepository = getRepository(Income);

    try {
      await incomeRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Incomes not found");
      return;
    }
    incomeRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default IncomeController;
