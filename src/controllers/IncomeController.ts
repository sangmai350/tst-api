import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Income } from "../entity/Income";

class IncomeController {
  public static listAllIncomes = async (req: Request, res: Response) => {
    // Get Incomes from database
    const incomesRepository = getRepository(Income);
    // const _incomes = await incomesRepository.find({ relations: ["personInCharge"] });

    const incomes = await incomesRepository
      .createQueryBuilder("income")
      .select([
        "income.id",
        "income.date",
        "income.value",
        "income.description",
        "user.username",
      ])
      .leftJoin("income.personInCharge", "user")
      .getMany();

    const totalIncome = await getRepository(Income)
      .createQueryBuilder("income")
      .select("SUM(income.value)", "value")
      .getRawOne();

    // Send the Incomes object
    res.send({ Income: incomes, TotalIncome: totalIncome });
  };

  public static getOneIncomeById = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id: string = req.params.id;

    // Get the Incomes from database
    const incomeRepository = getRepository(Income);
    try {
      const income = await incomeRepository.findOneOrFail(id, {
        select: ["id", "date", "value", "description", "personInCharge"],
      });
      res.send(income);
    } catch (error) {
      res.status(404).send("Incomes not found");
    }
  };

  public static newIncome = async (req: Request, res: Response) => {
    // Get parameters from the body
    const { date, value, description, personInCharge } = req.body;
    const income = new Income();
    income.date = date;
    income.value = value;
    income.description = description;
    income.personInCharge = personInCharge;

    // Validate if the parameters are ok
    const errors = await validate(income);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to save. If fails, check your params
    const incomeRepository = getRepository(Income);
    try {
      await incomeRepository.save(income);
    } catch (e) {
      res.status(409).send("Please check your params: " + e);
      return;
    }

    // If all ok, send 201 response
    res.status(201).send({ id: income.id });
  };

  public static editIncome = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { date, value, description, personInCharge } = req.body;

    // Try to find Incomes on database
    const incomeRepository = getRepository(Income);
    let income: Income;
    try {
      income = await incomeRepository.findOneOrFail(id);
    } catch (error) {
      // If not found, send a 404 response
      res.status(404).send("Incomes not found");
      return;
    }

    // Validate the new values on model
    income.date = date;
    income.value = value;
    income.description = description;
    income.personInCharge = personInCharge;

    const errors = await validate(income);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to safe, if fails, check your params
    try {
      await incomeRepository.save(income);
    } catch (e) {
      res.status(409).send("Please check your params");
      return;
    }
    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  public static deleteIncome = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    const incomeRepository = getRepository(Income);

    try {
      await incomeRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Incomes not found");
      return;
    }
    incomeRepository.delete(id);

    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default IncomeController;
