
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Outcome } from "../entity/InOutcome";

class OutcomeController {

  static listAllOucomes = async (req: Request, res: Response) => {
    //Get Outcomes from database
    const outcomesRepository = getRepository(Outcome);
    const _outcomes = await outcomesRepository.find({
      select: ["id", "date", "value", "description", "personInCharge"]
    });

    //Send the Outcomes object
    res.send(_outcomes);
  };

  static getOneOucomeById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the Outcomes from database
    const outcomesRepository = getRepository(Outcome);
    try {
      const _outcome = await outcomesRepository.findOneOrFail(id, {
        select: ["id", "date", "value", "description", "personInCharge"]
      });
      res.send(_outcome);
    } catch (error) {
      res.status(404).send("Outcome not found");
    }
  };

  static newOucome = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { date, value, description, personInCharge } = req.body;
    let _outcome = new Outcome();
    _outcome.date = date;
    _outcome.value = value;
    _outcome.description = description;
    _outcome.personInCharge = personInCharge;

    //Validade if the parameters are ok
    const errors = await validate(_outcome);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }


    //Try to save. If fails, check your params
    const outcomesRepository = getRepository(Outcome);
    try {
      await outcomesRepository.save(_outcome);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({ id: _outcome.id });
  };

  static editOucome = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    let { date, value, description, personInCharge } = req.body;

    //Try to find Outcomes on database
    const outcomesRepository = getRepository(Outcome);
    let _outcome: Outcome;
    try {
      _outcome = await outcomesRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Outcome not found");
      return;
    }

    //Validate the new values on model
    _outcome.date = date;
    _outcome.value = value;
    _outcome.description = description;
    _outcome.personInCharge = personInCharge;

    const errors = await validate(_outcome);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, check your params
    try {
      await outcomesRepository.save(_outcome);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteOucome = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const outcomesRepository = getRepository(Outcome);

    try {
      await outcomesRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Employee not found");
      return;
    }
    outcomesRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default OutcomeController;
