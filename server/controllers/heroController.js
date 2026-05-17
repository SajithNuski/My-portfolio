import Hero from "../models/Hero.js";

export const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero();
      await hero.save();
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero();
    }

    Object.assign(hero, req.body);
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
