import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Outcome } from "../entity/Outcome";

class OutcomeController {
  public static listAllOutcomes = async (req: Request, res: Response) => {
    // Get Outcomes from database
    const outcomesRepository = getRepository(Outcome);
    const outcomes = await outcomesRepository
      .createQueryBuilder("outcome")
      .select([
        "outcome.id",
        "outcome.date",
        "outcome.value",
        "outcome.description",
        "user.username",
      ])
      .leftJoin("outcome.personInCharge", "user")
      .getMany();

    const totalOutcome = await getRepository(Outcome)
      .createQueryBuilder("outcome")
      .select("SUM(outcome.value)", "value")
      .getRawOne();

    // Send the Incomes object
    res.send({ Outcome: outcomes, TotalOutcome: totalOutcome });
  };

  public static getOneOutcomeById = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id: string = req.params.id;

    // Get the Outcomes from database
    const outcomesRepository = getRepository(Outcome);
    try {
      const outcome = await outcomesRepository.findOneOrFail(id, {
        select: ["id", "date", "value", "description", "personInCharge"],
      });
      res.send(outcome);
    } catch (error) {
      res.status(404).send("Outcome not found");
    }
  };

  public static newOutcome = async (req: Request, res: Response) => {
    // Get parameters from the body
    const { date, value, description, personInCharge } = req.body;
    const outcome = new Outcome();
    outcome.date = date;
    outcome.value = value;
    outcome.description = description;
    outcome.personInCharge = personInCharge;

    // Validate if the parameters are ok
    const errors = await validate(outcome);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to save. If fails, check your params
    const outcomesRepository = getRepository(Outcome);
    try {
      await outcomesRepository.save(outcome);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }

    // If all ok, send 201 response
    res.status(201).send({ id: outcome.id });
  };

  public static editOutcome = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { date, value, description, personInCharge } = req.body;

    // Try to find Outcomes on database
    const outcomesRepository = getRepository(Outcome);
    let outcome: Outcome;
    try {
      outcome = await outcomesRepository.findOneOrFail(id);
    } catch (error) {
      // If not found, send a 404 response
      res.status(404).send("Outcome not found");
      return;
    }

    // Validate the new values on model
    outcome.date = date;
    outcome.value = value;
    outcome.description = description;
    outcome.personInCharge = personInCharge;

    const errors = await validate(outcome);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to safe, if fails, check your params
    try {
      await outcomesRepository.save(outcome);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }
    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  public static deleteOutcome = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    const outcomesRepository = getRepository(Outcome);

    try {
      await outcomesRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Employee not found");
      return;
    }
    outcomesRepository.delete(id);

    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default OutcomeController;
