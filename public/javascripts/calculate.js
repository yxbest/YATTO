var Artifact = function(name, ad0, adpl, levelcap, x, y, effect, desc) {
	this.name = name;
	this.ad0 = ad0;
	this.adpl = adpl;
	this.levelcap = levelcap;
	if (this.levelcap == 0) {
		this.levelcap = Infinity;
	}
	this.x = x;
	this.y = y;

	this.effect = effect;
	this.description = desc;

	this.cost = function(level) { return x * Math.pow(level, y) };

	this.getAD = function(level) {
		if (level == 0) {
			return 0;
		} else {
			return ad0 + adpl * (level - 1);
		}
	};

	this.costToLevel = function(level) {
		if (level == 0 || level >= this.levelcap) {
			return Infinity;
		} else {
			return Math.round(this.cost(level + 1)); // TODO: Check if round or floor
		}
	};

	this.costToLevelTo = function(level) {
		var c = 0;
		var l = 1;
		while (l != level) {
			c += this.costToLevel(l);
			l += 1;
		}
		return c;
	};

	this.getDescription = function(level) {
		var l = Math.max(0, Math.min(level, levelcap));
		return (l * effect).toString() + "%" + this.description;
	};
}

var artifact_info = [
	new Artifact("Amulet of the Valrunes",   50,  25,  0, 0.7, 2.0,   10, "gold from monsters"),       //  0 monster gold
	new Artifact("Axe of Resolution",        70,  35,  0, 0.5, 1.7,   10, "Berserker Rage duration"),  //  1 BR duration
	new Artifact("Barbarian's Mettle",       70,  35, 10, 0.4, 1.5,   -5, "Berserker Rage cooldown"),  //  2 BR CDR
	new Artifact("Chest of Contentment",     40,  20,  0, 1.0, 1.5,   20, "Chesterson gold"),          //  3 chesterson gold
	new Artifact("Crafter's Elixir",         40,  20,  0, 0.5, 1.8,   15, "gold from all sources"),    //  4 increase gold (multiplicative)
	new Artifact("Crown Egg",                40,  20,  0, 1.0, 1.5,   20, "base Chesterson chance"),   //  5 chesterson chance
	new Artifact("Dark Cloak of Life",       30,  15, 25, 0.5, 2.0,   -2, "boss health"),              //  6 boss life
	new Artifact("Death Seeker",             30,  15, 25, 0.8, 2.5,   10, "base crit chance"),         //  7 crit chance
	new Artifact("Divine Chalice",           30,  15,  0, 0.7, 1.7,  0.5, "chance for 10x gold"),      //  8 chance for 10x gold
	new Artifact("Drunken Hammer",           60,  30,  0, 0.6, 1.7,    2, "tap damage"),               //  9 tap damage
	new Artifact("Future's Fortune",         30,  15,  0, 0.7, 2.0,    5, "gold from all sources"),    // 10 increase gold (additive)
	new Artifact("Hero's Thrust",            30,  15,  0, 0.7, 1.7,   20, "crit damage"),              // 11 crit damage
	new Artifact("Hunter's Ointment",       120,  60, 10, 0.4, 1.5,   -5, "War Cry cooldown"),         // 12 WC CDR
	new Artifact("Knight's Shield",          60,  30,  0, 0.7, 1.5,  100, "gold from bosses"),         // 13 boss gold
	new Artifact("Laborer's Pendant",        70,  35, 10, 0.7, 1.5,   -5, "Hand of Midas cooldown"),   // 14 HoM CDR
	new Artifact("Ogre's Gauntlet",          70,  35,  0, 0.5, 1.7,   10, "Shadow Clone duration"),    // 15 SC duration
	new Artifact("Otherworldly Armor",       70,  35, 10, 1.0, 2.2,   -5, "hero death chance"),        // 16 hero death chance
	new Artifact("Overseer's Lotion",        70,  35, 10, 0.4, 1.5,   -5, "Shadow Clonse cooldown"),   // 17 SC CDR
	new Artifact("Parchment of Importance",  70,  35,  0, 0.5, 1.7,   10, "Critical Strike duration"), // 18 CS duration
	new Artifact("Ring of Opulence",         70,  35,  0, 0.7, 1.7,   10, "Hand of Midas duration"),   // 19 HoM duration
	new Artifact("Ring of Wondrous Charm",   30,  15, 25, 0.5, 1.7,   -2, "hero upgrade cost"),        // 20 upgrade cost
	new Artifact("Sacred Scroll",            70,  35, 10, 0.4, 1.5,   -5, "Critical Strike cooldown"), // 21 CS CDR
	new Artifact("Saintly Shield",           70,  35, 10, 0.3, 1.5,   -5, "Heavenly Strike cooldown"), // 22 HS CDR
	new Artifact("Savior Shield",            30,  15, 25, 0.5, 1.7,   10, "boss time"),                // 23 boss time
	new Artifact("Tincture of the Maker",    10,   5,  0, 0.6, 2.5,    5, "overall all damage"),       // 24 all damage
	new Artifact("Undead Aura",              30,  15,  0, 0.7, 2.0,    5, "relics from prestige"),     // 25 bonus relics
	new Artifact("Universal Fissure",       120,  60,  0, 0.5, 1.7,   10, "War Cry duration"),         // 26 WR duration
	new Artifact("Warrior's Revival",        70,  35, 10, 1.0, 2.2,   -5, "hero revive time"),         // 27 revive time
	new Artifact("Worldly Illuminator",     300, 150,  5, 0.6, 3.0, -100, "monsters per stage")        // 28 number of mobs
];

var numSkillTypes = 9;
var STYPE_HERO_DPS     = 0;
var STYPE_ALL_DAMAGE   = 1;
var STYPE_CRIT_DAMAGE  = 2;
var STYPE_TAP_DAMAGE   = 3;
var STYPE_PERCENT_DPS  = 4;
var STYPE_CHEST_GOLD   = 5;
var STYPE_GOLD_DROPPED = 6;
var STYPE_BOSS_DAMAGE  = 7;
var STYPE_CRIT_CHANCE  = 8;

var SKILL_LEVELS = [10, 25, 50, 100, 200, 400, 800, 1010, 1025, 1050, 1100, 1200, 1400, 1800];
var precompute_upgrade_cost = 6000;

var level_to_skills = function(level) {
	var eqLevel = (level > 1000 ? level - 1000 : level);
	var slevels = [10, 25, 50, 100, 200, 400, 800];
	for (var l in slevels) {
		if (eqLevel < slevels[l]) {
			return l;
		}
	}
	return 7;
}

var Hero = function(name, id, base_cost, skills) {
	this.name = name;
	this.id = id;
	this.base_cost = base_cost;
	this.base_cost10 = 10 * base_cost;
	this.skills = skills;
	this.upgrade_costs = [base_cost];
	for (var i = 1; i < precompute_upgrade_cost; i++) {
		this.upgrade_costs.push((i < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, i));
	}
	this.evolve_cost = 10.75 * this.upgrade_costs[999] // TODO: check this

	this.get_upgrade_cost = function(level) {
		if (level < precompute_upgrade_cost) {
			return this.upgrade_costs[level];
		}
		return (level < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, level);
	};

	this.cost_to_level = function(start_level, end_level) {
		if (end_level == start_level + 1) {
			return this.get_upgrade_cost(start_level);
		}
		if (end_level <= 1000) {
			return this.base_cost * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
		}
		if (start_level >= 1000) {
			return this.base_cost10 * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
		}
		return this.cost_to_level(start_level, 1000) + this.evolve_cost + this.cost_to_level(1000, end_level);
	};

	this.cost_to_next_skill = []
	for (var i = 0; i < 2000; i++) {
		for (var l in SKILL_LEVELS) {
			if (i < SKILL_LEVELS[l]) {
				this.cost_to_next_skill.push(this.cost_to_level(i, SKILL_LEVELS[l]));
				break;
			}
		}
	}

	this.cost_to_buy_skill = function(level) {
		if (level < 1000) {
			return 5 * this.get_upgrade_cost(level + 1);
		}
		return 0.5 * this.get_upgrade_cost(level + 1);
	};


	this.get_cost_to_next_skill = function(level) {
		for (var l in SKILL_LEVELS) {
			if (level < SKILL_LEVELS[l]) {
				return [SKILL_LEVELS[l], this.cost_to_next_skill[level]];
			}
		}
		return [0, Infinity];
	};

	this.get_bonuses = function(level, stype) {
		var bonus = 0;
		for (var i = 0; i < level_to_skills(level); i++) {
			if (skills[i][1] == stype) {
				bonus += skills[i][0];
			}
		}
		return bonus;
	};

	this.get_base_damage = function(level) {
		var n, m;
		var c = this.get_upgrade_cost(level - 1);
		if (level >= 1001) {
			n = Math.max(Math.pow(0.904, level - 1001) * Math.pow(0.715, this.id + 33), 1e-308);
			m = Math.pow(1.075, level - 1000) - 1;
		} else {
			n = Math.max(Math.pow(0.904, level - 1) * Math.pow(1 - (0.019 * Math.min(this.id, 15)), this.id), 1e-308);
			m = Math.pow(1.075, level) - 1;
		}
		return (n * c * m) / 0.75;
	};
}

var hero_info = [
	new Hero("Takeda the Blade Assassin", 1, 50, [
		[0.50, STYPE_HERO_DPS], [1.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_CRIT_DAMAGE],
		[10.00, STYPE_HERO_DPS], [0.25, STYPE_ALL_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Contessa the Torch Wielder", 2, 175, [
		[0.05, STYPE_TAP_DAMAGE], [1.00, STYPE_HERO_DPS], [10.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS],
		[0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_GOLD_DROPPED], [100.00, STYPE_HERO_DPS]]),
	new Hero("Hornetta, Queen of the Valrunes", 3, 674, [
		[1.50, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE], [0.004, STYPE_PERCENT_DPS],
		[0.20, STYPE_CHEST_GOLD], [0.01, STYPE_CRIT_CHANCE], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Mila the Hammer Stomper", 4, 2.85e3, [
		[1.00, STYPE_HERO_DPS], [8.00, STYPE_HERO_DPS], [0.06, STYPE_GOLD_DROPPED], [5.00, STYPE_HERO_DPS],
		[0.05, STYPE_CRIT_DAMAGE], [0.20, STYPE_ALL_DAMAGE], [0.20, STYPE_CHEST_GOLD]]),
	new Hero("Terra the Land Scorcher", 5, 13.30e3, [
		[3.00, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.004, STYPE_PERCENT_DPS], [0.15, STYPE_GOLD_DROPPED],
		[0.20, STYPE_CHEST_GOLD], [0.05, STYPE_TAP_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Inquisireaux the Terrible", 6, 68.10e3, [
		[2.00, STYPE_HERO_DPS], [7.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE],
		[0.05, STYPE_CRIT_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Charlotte the Special", 7, 384.00e3, [
		[2.00, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [0.07, STYPE_BOSS_DAMAGE], [6.00, STYPE_HERO_DPS],
		[0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_CHEST_GOLD], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Jordaan, Knight of Mini", 8, 2.38e6, [
		[2.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.004, STYPE_PERCENT_DPS], [0.15, STYPE_GOLD_DROPPED],
		[0.20, STYPE_CHEST_GOLD], [19.00, STYPE_HERO_DPS], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Jukka, Master of Axes", 9, 23.80e6, [
		[1.50, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.05, STYPE_CRIT_DAMAGE],
		[50.00, STYPE_HERO_DPS], [0.25, STYPE_ALL_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Milo and Clonk-Clonk", 10, 143.00e6, [
		[1.50, STYPE_HERO_DPS], [0.01, STYPE_CRIT_CHANCE], [0.05, STYPE_BOSS_DAMAGE], [0.15, STYPE_GOLD_DROPPED],
		[0.20, STYPE_CHEST_GOLD], [0.25, STYPE_CHEST_GOLD], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Macelord the Ruthless", 11, 943.00e6, [
		[2.00, STYPE_HERO_DPS], [8.50, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.004, STYPE_PERCENT_DPS],
		[0.15, STYPE_GOLD_DROPPED], [0.05, STYPE_TAP_DAMAGE], [38.00, STYPE_HERO_DPS]]),
	new Hero("Gertrude the Goat Rider", 12, 6.84e9, [
		[2.50, STYPE_HERO_DPS], [13.00, STYPE_HERO_DPS], [0.07, STYPE_BOSS_DAMAGE], [0.05, STYPE_CRIT_DAMAGE],
		[0.004, STYPE_PERCENT_DPS], [0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_GOLD_DROPPED]]),
	new Hero("Twitterella the Tweeter", 13, 54.70e9, [
		[1.50, STYPE_HERO_DPS], [8.50, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_ALL_DAMAGE],
		[0.30, STYPE_ALL_DAMAGE], [0.05, STYPE_CRIT_DAMAGE], [120.00, STYPE_HERO_DPS]]),
	new Hero("Master Hawk, Lord of Luft", 14, 820.00e9, [
		[2.00, STYPE_HERO_DPS], [11.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [4.00, STYPE_HERO_DPS],
		[0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_CRIT_DAMAGE], [0.20, STYPE_GOLD_DROPPED]]),
	new Hero("Elpha, Wielder of Gems", 15, 8.20e12, [
		[3.00, STYPE_HERO_DPS], [0.40, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE], [0.02, STYPE_CRIT_CHANCE],
		[0.15, STYPE_CRIT_DAMAGE], [0.20, STYPE_CHEST_GOLD], [100.00, STYPE_HERO_DPS]]),
	new Hero("Poppy, Daughter of Ceremony", 16, 164.00e12, [
		[3.50, STYPE_HERO_DPS], [0.25, STYPE_CHEST_GOLD], [0.20, STYPE_GOLD_DROPPED], [0.05, STYPE_BOSS_DAMAGE],
		[0.07, STYPE_BOSS_DAMAGE], [0.15, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Skulptor, Protector of Bridges", 17, 1.64e15, [
		[1.50, STYPE_HERO_DPS], [9.00, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_GOLD_DROPPED],
		[0.05, STYPE_TAP_DAMAGE], [0.10, STYPE_CRIT_DAMAGE], [0.25, STYPE_GOLD_DROPPED]]),
	new Hero("Sterling the Enchantor", 18, 49.20e15, [
		[4.00, STYPE_HERO_DPS], [5.00, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [4.50, STYPE_HERO_DPS],
		[0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_CHEST_GOLD], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Orba the Foreseer", 19, 2.46e18, [
		[2.00, STYPE_HERO_DPS], [10.00, STYPE_HERO_DPS], [0.005, STYPE_PERCENT_DPS], [0.05, STYPE_TAP_DAMAGE],
		[0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE]]),
	new Hero("Remus the Noble Archer", 20, 73.80e18, [
		[2.50, STYPE_HERO_DPS], [6.00, STYPE_HERO_DPS], [0.20, STYPE_CRIT_DAMAGE], [4.50, STYPE_HERO_DPS],
		[0.004, STYPE_PERCENT_DPS], [0.10, STYPE_TAP_DAMAGE], [0.10, STYPE_GOLD_DROPPED]]),
	new Hero("Mikey the Magician Apprentice", 21, 2.44e21, [
		[2.00, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.02, STYPE_CRIT_CHANCE],
		[0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_CHEST_GOLD], [100.00, STYPE_HERO_DPS]]),
	new Hero("Peter Pricker the Prickly Poker", 22, 244.00e21, [
		[2.50, STYPE_HERO_DPS], [7.50, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [5.00, STYPE_HERO_DPS],
		[0.10, STYPE_ALL_DAMAGE], [0.30, STYPE_CRIT_DAMAGE], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Teeny Tom, Keeper of the Castle", 23, 48.70e24, [
		[3.00, STYPE_HERO_DPS], [8.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [0.20, STYPE_CRIT_DAMAGE],
		[0.10, STYPE_TAP_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Deznis the Cleanser", 24, 19.50e27, [
		[2.00, STYPE_HERO_DPS], [5.00, STYPE_HERO_DPS], [12.00, STYPE_HERO_DPS], [0.15, STYPE_GOLD_DROPPED],
		[0.20, STYPE_CHEST_GOLD], [90.00, STYPE_HERO_DPS], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Hamlette, Painter of Skulls", 25, 21.40e30, [
		[0.05, STYPE_TAP_DAMAGE], [0.05, STYPE_TAP_DAMAGE], [0.004, STYPE_PERCENT_DPS], [0.10, STYPE_ALL_DAMAGE],
		[0.15, STYPE_GOLD_DROPPED], [0.02, STYPE_CRIT_CHANCE], [150.00, STYPE_HERO_DPS]]),
	new Hero("Eistor the Banisher", 26, 2.36e36, [
		[3.50, STYPE_HERO_DPS], [6.50, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [0.05, STYPE_BOSS_DAMAGE],
		[0.10, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE], [0.12, STYPE_GOLD_DROPPED]]),
	new Hero("Flavius and Oinksbjorn", 27, 25.90e45, [
		[3.00, STYPE_HERO_DPS], [7.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE],
		[0.02, STYPE_CRIT_CHANCE], [0.30, STYPE_CRIT_DAMAGE], [0.20, STYPE_CHEST_GOLD]]),
	new Hero("Chester the Beast Tamer", 28, 28.50e60, [
		[3.50, STYPE_HERO_DPS], [0.01, STYPE_ALL_DAMAGE], [4.00, STYPE_HERO_DPS], [6.00, STYPE_HERO_DPS],
		[0.20, STYPE_CRIT_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Mohacas the Wind Warrior", 29, 3.14e81, [
		[3.30, STYPE_HERO_DPS], [5.50, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_TAP_DAMAGE],
		[0.20, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE], [0.30, STYPE_GOLD_DROPPED]]),
	new Hero("Jaqulin the Unknown", 30, 3.14e96, [
		[10.00, STYPE_HERO_DPS], [0.10, STYPE_TAP_DAMAGE], [0.04, STYPE_PERCENT_DPS], [0.20, STYPE_GOLD_DROPPED],
		[0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Pixie the Rebel Fairy", 31, 3.76e116, [
		[9.00, STYPE_HERO_DPS], [20.00, STYPE_HERO_DPS], [0.01, STYPE_CRIT_CHANCE], [0.60, STYPE_TAP_DAMAGE],
		[0.25, STYPE_CHEST_GOLD], [0.10, STYPE_ALL_DAMAGE], [0.15, STYPE_GOLD_DROPPED]]),
	new Hero("Jackalope the Fireballer", 32, 4.14e136, [
		[0.40, STYPE_HERO_DPS], [0.20, STYPE_HERO_DPS], [0.25, STYPE_GOLD_DROPPED], [0.60, STYPE_TAP_DAMAGE],
		[0.02, STYPE_CRIT_CHANCE], [0.30, STYPE_ALL_DAMAGE], [0.10, STYPE_BOSS_DAMAGE]]),
	new Hero("Dark Lord, Punisher of All", 33, 4.56e156, [
		[20.00, STYPE_HERO_DPS], [0.20, STYPE_TAP_DAMAGE], [0.01, STYPE_PERCENT_DPS], [0.25, STYPE_GOLD_DROPPED],
		[0.20, STYPE_ALL_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.40, STYPE_ALL_DAMAGE]])];


var TOTAL_STYPE_GOLD_DROPPED = 0;
for (var h in hero_info) {
	for (var s in hero_info[h].skills) {
		if (hero_info[h].skills[s][1] == STYPE_GOLD_DROPPED) {
			TOTAL_STYPE_GOLD_DROPPED += hero_info[h].skills[s][0];
		}
	}
}

var next_ff_level = function(ff, c_gd) {
	var new_level = ff;
	var multiplier = function(l) {
		return Math.ceil(1 + 0.05 * l + TOTAL_STYPE_GOLD_DROPPED + c_gd);
	}
	while (multiplier(new_level) == multiplier(ff)) {
		new_level += 1;
	}
	return new_level;
};

var all_damage = function(artifacts) {
	var total_ad = 0;
	for (var i in artifacts) {
		total_ad += artifact_info[i].getAD(artifacts[i]);
	}
	total_ad *= (1 + 0.05 * artifacts[24]);
	return Math.round(total_ad);
};

var cost_to_buy_next = function(artifacts) {
	if (! 0 in artifacts) {
		return Infinity;
	}
	var owned = artifacts.filter(function(l) { return l != 0; }).length + 1;
	return Math.floor(owned * Math.pow(1.35, owned));
};

var get_hero_weapon_bonuses = function(weapons) {
	return weapons.map(function(n) { return 1 + 0.5 * n; });
};

var number_of_sets = function(weapons) {
	return Math.min.apply(null, weapons);
};

var set_bonus = function(weapons) {
	var sets = number_of_sets(weapons);
	if (sets == 0) {
		return 1;
	} else {
		return 10 * sets;
	}
};

var next_boss_stage = function(stage) {
	// if on boss stage returns that stage, because haven't beat it yet
	return Math.floor(Math.ceil(stage * 0.2)) * 5;
};

var stage_constant = 18.5 * Math.pow(1.57, 156);
var stage_hp = function(stage) {
	if (stage <= 156) {
		return 18.5 * Math.pow(1.57, stage);
	}
	return stage_constant * Math.pow(1.17, stage - 156);
};

var boss_hp = function(stage) {
	switch (stage % 10) {
		case 1:
		case 6:
			return stage_hp(stage) * 2;
		case 2:
		case 7:
			return stage_hp(stage) * 4;
		case 3:
		case 8:
			return stage_hp(stage) * 6;
		case 4:
		case 9:
			return stage_hp(stage) * 7;
		case 5:
		case 0:
			return stage_hp(stage) * 10;
	}
}

var log117 = Math.log(1.17);
var log157 = Math.log(1.57);
var health_to_stage = function(health) {
	if (health > stage_constant) {
		return Math.round(Math.log(health / stage_constant) / log117 + 156);
	} else {
		return Math.round(Math.log(health / 18.5) / log157);
	}
};

var base_stage_gold = function(stage) {
	return stage_hp(stage) * (0.02 + 0.00045 * Math.min(stage, 150));
};

// TODO: Check this constant
var BOSS_CONSTANT = (2 + 4*1.14 + 6*Math.pow(1.14, 2) + 7*Math.pow(1.14, 3) + 10*Math.pow(1.14, 4))/(1 + 1.14 + Math.pow(1.14, 2) + Math.pow(1.14, 3) + Math.pow(1.14, 4));
//BOSS_CONSTANT = 6;

var newZeroes = function(length) {
	return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var sumArray = function(array) {
	return array.reduce(function(a, b) { return a + b; });
};

var BASE_CRIT_CHANCE = 0.02;
var BASE_CHEST_CHANCE = 0.02;
var GameState = function(artifacts, weapons, levels, customizations, others) {
	this.artifacts = artifacts.slice();
	this.a_ad = 0.01 * all_damage(this.artifacts);
	this.l_amulet    = artifacts[0];
	this.l_axe       = artifacts[1];
	this.l_chest     = artifacts[3];
	this.l_elixir    = artifacts[4];
	this.l_egg       = artifacts[5];
	this.l_dseeker   = artifacts[7];
	this.l_chalice   = artifacts[8];
	this.l_hammer    = artifacts[9];
	this.l_fortune   = artifacts[10];
	this.l_hthrust   = artifacts[11];
	this.l_kshield   = artifacts[13];
	this.l_parchment = artifacts[18];
	this.l_charm     = artifacts[20];
	this.l_ua        = artifacts[25];
	this.l_world     = artifacts[28];
	this.main_dmg = 600 * Math.pow(1.05, 600);

	this.weapons = weapons.slice();
	this.w_bh = get_hero_weapon_bonuses(this.weapons);
	this.w_sb = set_bonus(this.weapons);

	this.customizations = customizations.slice();
	this.c_ad = customizations[0];
	this.c_cd = customizations[1];
	this.c_gd = customizations[2];
	this.c_cg = customizations[3];
	this.c_cc = customizations[4];
	this.c_td = customizations[5];

	this.others = others ? others : {};

	this.c_chance = Math.min(1, BASE_CHEST_CHANCE + 0.004 * this.l_egg);
	this.n_chance = 1 - this.c_chance;

	this.n_gold = 1 + 0.1 * this.l_amulet;
	this.d_chance = Math.min(1, 0.005 * this.l_chalice);
	this.d_multiplier = 1 - this.d_chance + 10 * this.d_chance;
	this.m_multiplier = this.n_chance * this.n_gold * this.d_multiplier;
	this.boss_gold = BOSS_CONSTANT * (1 + this.l_kshield);

	// this.other_total = (1 + this.c_gd) * (1 + 0.15 * this.l_elixir) * (1 / (1 - 0.02 * this.l_charm));
	this.other_total = (1 + 0.15 * this.l_elixir) * (1 / (1 - 0.02 * this.l_charm));

	this.heroes = levels.slice();
	this.hero_skills = newZeroes(hero_info.length);
	this.skill_bonuses = newZeroes(numSkillTypes);
	this.current_stage = 1;
	this.current_gold = 0;
	this.time = 0;

	this.new_run = function() {
		this.heroes = newZeroes(hero_info.length);
		this.hero_skills = newZeroes(hero_info.length);
		this.skill_bonuses = newZeroes(numSkillTypes);
		this.current_stage = 1;
		this.current_gold = 0;
		this.time = 0;
	};

	this.add_skill = function(h, s) {
		var skill = hero_info[h].skills[s];
		this.skill_bonuses[skill[1]] += skill[0];
	};

	this.get_all_skills = function() {
		for (var i = 0; i < this.heroes.length; i++) {
			var skills = level_to_skills(this.heroes[i]);
			for (var s = 0; s < skills; s++) {
				this.add_skill(i, s);
				this.hero_skills[i] = s;
			}
		}
	};

	this.total_relics = function() {
		if (this.current_stage < 90) {
			return 0;
		}
		var stage_relics = Math.pow(Math.floor(this.current_stage/15) - 5, 1.7);
		var hero_relics = Math.floor(sumArray(this.heroes) / 1000);
		var multiplier = 2 + 0.1 * this.l_ua;
		return Math.floor((stage_relics + hero_relics) * multiplier);
	};

	this.get_total_bonus = function(stype) {
		return this.skill_bonuses[stype];
	};

	this.gold_multiplier = function() {
		var mobs = 10 - this.l_world;

		var h_cg = this.get_total_bonus(STYPE_CHEST_GOLD);
		var h_gd = this.get_total_bonus(STYPE_GOLD_DROPPED);

		var c_gold = 10 * (1 + 0.2 * this.l_chest) * (1 + this.c_cg) * (1 + h_cg);

		var m_gold = mobs * (this.c_chance * c_gold + this.m_multiplier);
		var multiplier_gold = (m_gold + this.boss_gold) / (mobs + 1);
		//var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd) * this.other_total;
		var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd + this.c_gd) * this.other_total;

		return multiplier_gold * multiplier_total;
	};

	this.mob_multiplier = function() {
		var h_cg = this.get_total_bonus(STYPE_CHEST_GOLD);
		var h_gd = this.get_total_bonus(STYPE_GOLD_DROPPED);

		var c_gold = 10 * (1 + 0.2 * this.l_chest) * (1 + this.c_cg) * (1 + h_cg);
		var multiplier_mob = this.c_chance * c_gold + this.m_multiplier;
		var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd) * this.other_total;
		return multiplier_mob * multiplier_total;
	};

	// TODO: take into account particular boss multiplier for stage
	this.gold_for_stage = function(stage) {
		var mobs = 10 - this.l_world + 1;
		var base = base_stage_gold(stage);
		var mult = this.gold_multiplier();
		return mobs * base * mult;
	};

	// TODO: take into account particular boss multiplier for stage
	this.gold_between_stages = function(start_stage, end_stage) {
		var total = 0;
		for (var i = start_stage; i < end_stage; i++) {
			total += base_stage_gold(i);
		}
		var mobs = 10 - this.l_world + 1;
		var mult = this.gold_multiplier();
		return mobs * mult * total;
	};

	this.get_crit_multiplier = function() {
		var h_cd = this.get_total_bonus(STYPE_CRIT_DAMAGE);
		return (10 + h_cd) * (1 + 0.2 * this.l_hthrust) * (1 + this.c_cd);
	};

	this.get_crit_chance = function() {
		var h_cc = this.get_total_bonus(STYPE_CRIT_CHANCE);
		return Math.min(1, BASE_CRIT_CHANCE + 0.02 * this.l_dseeker + this.c_cc + h_cc);
	};

	this.get_hero_dps = function() {
		var dps = 0;
		var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
		for (var i in this.heroes) {
			var level = this.heroes[i];
			if (level == 0) {
				continue;
			}

			var hero_dps = hero_info[i].get_base_damage(level);
			var m_hero = 1 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + h_ad;
			var m_artifact = 1 + this.a_ad;
			var m_customization = 1 + this.c_ad;
			var m_weapon = this.w_bh[i];
			var m_set = this.w_sb;

			hero_dps = hero_dps * m_hero * m_artifact * m_customization * m_weapon * m_set;
			dps += hero_dps;
		}
		return dps;
	};

	this.tap_damage = function() {
		var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
		var h_td = this.get_total_bonus(STYPE_TAP_DAMAGE);
		var h_pd = this.get_total_bonus(STYPE_PERCENT_DPS);
		var h_cd = this.get_total_bonus(STYPE_CRIT_DAMAGE);
		var h_cc = this.get_total_bonus(STYPE_CRIT_CHANCE);

		var hero_total_dps = this.get_hero_dps();

		// from_main = MAIN_LEVEL * pow(1.05, MAIN_LEVEL) * (1 + h_ad)
		var from_main = this.main_dmg * (1 + h_ad);
		var from_hero = (h_pd * hero_total_dps) * (1 + h_td + this.c_td) * (1 + this.a_ad) * (1 + 0.02 * this.l_hammer) * (1 + this.c_ad);
		var total_tap = from_main + from_hero;

		var crit_multiplier = this.get_crit_multiplier();
		var crit_chance = this.get_crit_chance();

		var overall_crit_multiplier = ((1 - crit_chance) + (crit_chance * 0.65 * crit_multiplier));
		var total_tapping = total_tap * overall_crit_multiplier;

		var a_crit_uptime = this.l_parchment > 0 ? Math.min((30 + 3 * this.l_parchment) / 900, 1) : 0;
		var a_crit_bonus = this.others.cs > 0 ? (0.17 + (this.others.cs - 1) * 0.03) : 0;

		var a_crit_chance = Math.min(1, crit_chance + a_crit_uptime * a_crit_bonus);
		var a_overall_crit_multiplier = ((1 - a_crit_chance) + (a_crit_chance * 0.65 * crit_multiplier));

		var a_tap_uptime = this.l_axe > 0 ? Math.min((30 + 3 * this.l_axe) / 1800, 1) : 0;
		var a_tap_bonus = this.others.br > 0 ? (0.70 + (this.others.br - 1) * 0.3) : 0;

		var a_total_tapping = total_tap * a_overall_crit_multiplier * (1 + a_tap_uptime * a_tap_bonus);

		return [total_tap, total_tapping, a_total_tapping];
	};

	this.level_heroes = function() {
		// buy all the heroes that you can buy
		var heroes_after = this.heroes.slice();
		for (var i in heroes_after) {
			var level = heroes_after[i];
			if (level == 0 && hero_info[i].base_cost < this.current_gold) {
				heroes_after[i] += 1;
				this.current_gold -= hero_info[i].base_cost;
			}
		}

		// level your last hero as much as possible
		var owned = heroes_after.filter(function(h) { return h != 0; });
		var last_owned = owned.length - 1;
		var level_last = heroes_after[last_owned];

		// TODO: javascript is stupid
		if (last_owned != -1) {
			for (var i in [100, 10, 1]) {
				var k = Math.pow(10, (2 - i));
				var cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
				while (cost < this.current_gold) {
					heroes_after[last_owned] += k;
					level_last = heroes_after[last_owned];
					this.current_gold -= cost;
					cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
				}
			}
		}

		// buy all the skills that you can
		for (var i in heroes_after) {
			if (heroes_after[i] == 0) {
				continue;
			}
			var level = heroes_after[i];
			var temp = hero_info[i].get_cost_to_next_skill(level);
			var next_skill_level = temp[0];
			var cost = temp[1];
			cost += hero_info[i].cost_to_buy_skill(next_skill_level);
			while (cost < this.current_gold && level < 800) {
				heroes_after[i] = next_skill_level;
				// TODO: check this, hero_skills
				this.add_skill(i, this.hero_skills[i]);
				this.hero_skills[i] += 1;
				level = next_skill_level;
				this.current_gold -= cost;
				temp = hero_info[i].get_cost_to_next_skill(level);
				next_skill_level = temp[0];
				cost = temp[1];
				cost += hero_info[i].cost_to_buy_skill(next_skill_level);
			}
		}

		this.heroes = heroes_after;
	};

	this.evolve_heroes = function() {
		var heroes_after = this.heroes.slice();

		// level your last hero as much as possible
		var owned = heroes_after.filter(function(h) { return h != 0; });
		var last_owned = owned.length - 1;
		var level_last = heroes_after[last_owned];

		// TODO: javascript is stupid
		if (last_owned != -1) {
			for (var i in [100, 10, 1]) {
				var k = Math.pow(10, (2 - i));
				var cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
				while (cost < this.current_gold) {
					heroes_after[last_owned] += k;
					level_last = heroes_after[last_owned];
					this.current_gold -= cost;
					cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
				}
			}
		}

		for (var i in heroes_after) {
			var level = heroes_after[i];
			if (level == 1000 && hero_info[i].evolve_cost < this.current_gold) {
				heroes_after[i] += 1;
				this.current_gold -= hero_info[i].evolve_cost;
			}
		}
		this.heroes = heroes_after;
	};

	// TODO: Use this to figure out when to prestige
	this.calculate_rps_per_stage = function() {
		var TAPS_PER_SECOND = 10;
		this.new_run();

		var done = false;
		var rps = {};
		var mobs = 10 - this.l_world;
		while (!done) {
			var temp = this.tap_damage();
			var tapping = temp[1];
			var dps = TAPS_PER_SECOND * tapping;

			var mobs_health = stage_hp(this.current_stage);
			var boss_health = boss_hp(this.current_stage);

			var base_time = 0.75; // 4.5/6
			var mobs_time = base_time + Math.ceil(mobs_health / tapping) / TAPS_PER_SECOND;
			var boss_time = base_time + Math.ceil(boss_health / tapping) / TAPS_PER_SECOND;
			var total_time = mobs * mobs_time + boss_time;

			if (boss_time > 5) {
				// cannot kill boss in 5 seconds, see if we want to grind
				var owned_heroes = this.heroes.filter(function(h) { return h != 0; });
				var next_hero = owned_heroes.length;
				var grind_target = 0;
				if (next_hero == 33 && this.heroes[32] < 1001) {

					grind_target = hero_info[32].evolve_cost;
					grind = "evolve";
				} else if (next_hero == 33) {
					end_game = true;
					continue;
				} else {
					grind_target = hero_info[next_hero].base_cost;
					grind = "hero";
				}

				var gold_needed = grind_target - this.current_gold;
				// check if we can already get whatever we were grinding for
				if (gold_needed < 0) {
					if (grind == "evolve") {
						this.evolve_heroes();
					}
					if (grind == "hero") {
						this.level_heroes();
					}
					continue;
				}

				var mob_gold = this.mob_multiplier() * base_stage_gold(this.current_stage);
				// console.log(gold_needed / mob_gold);
				if (gold_needed < 10000 * mob_gold) {
					this.current_gold += mob_gold;
					this.time += mobs_time;
				} else {
					done = true;
					continue;
				}
			} else {
				// Pass stage
				this.current_gold += this.gold_for_stage(this.current_stage);
				if (this.current_stage % 5 == 0) {
					this.level_heroes();
				}
				this.time += total_time;
				this.current_stage += 1;
				rps[this.current_stage] = [this.total_relics() / this.time, boss_time];
			}
		}
	}

	// TODO: make list of log so people can see what's going on
	this.relics_per_second = function() {
		var TAPS_PER_SECOND = 10; // TODO: make this user variable
		this.new_run();

		var done = false;
		var grind = "";
		var end_game = false;
		while (!done) {
			var temp = this.tap_damage();
			var tap = temp[0];
			var tapping = temp[1];

			// ohko things if we can
			var ohko_stage = health_to_stage(tap);
			if (ohko_stage > this.current_stage) {
				this.current_gold += this.gold_between_stages(this.current_stage, ohko_stage + 1);
				this.level_heroes();
				this.time += 4.5 * (ohko_stage - this.current_stage);
				this.current_stage = ohko_stage + 1;
				continue;
			}

			// cannot ohko anymore, start tapping
			var ohko_tapping_stage = health_to_stage(tapping);
			if (ohko_tapping_stage > this.current_stage) {
				this.current_gold += this.gold_between_stages(this.current_stage, ohko_tapping_stage + 1);
				this.level_heroes();
				// TODO: check this, tapping ohko slightly slower than sc ohko?
				this.time += 4.75 * (ohko_tapping_stage - this.current_stage);
				this.current_stage = ohko_tapping_stage + 1;
				continue;
			}


			// cannot ohko anymore, 5 seconds of tapping per boss
			var five_seconds = tapping * TAPS_PER_SECOND * 5;
			var next_boss = next_boss_stage(this.current_stage);
			if (five_seconds > stage_hp(next_boss) * 10) {
				this.current_gold += this.gold_between_stages(this.current_stage, next_boss + 1);
				this.level_heroes();
				var dps = tapping * TAPS_PER_SECOND;
				this.time += (next_boss - this.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps);
				this.current_stage = next_boss + 1;
				continue;
			}

			if (end_game) {
				var oneohfive_seconds = tapping * TAPS_PER_SECOND * 105;
				var next_boss = next_boss_stage(this.current_stage);
				if (oneohfive_seconds > stage_hp(next_boss) * 10) {
					this.current_gold += this.gold_between_stages(this.current_stage, next_boss + 1);
					this.level_heroes();
					var dps = tapping * TAPS_PER_SECOND;
					// TODO: 12 is random approximation, do better
					this.time += (next_boss - this.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps);
					this.current_stage = next_boss + 1;
					continue;
				} else {
					done = true;
					continue;
				}
			}

			// cannot kill boss in 5 seconds, see if we want to grind

			var owned_heroes = this.heroes.filter(function(h) { return h != 0; });
			var next_hero = owned_heroes.length;
			var grind_target = 0;
			if (next_hero == 33 && this.heroes[32] < 1001) {
				grind_target = hero_info[32].evolve_cost;
				grind = "evolve";
			} else if (next_hero == 33) {
				end_game = true;
				continue;
			} else {
				grind_target = hero_info[next_hero].base_cost;
				grind = "hero";
			}

			var gold_needed = grind_target - this.current_gold;
			// check if we can already get whatever we were grinding for
			if (gold_needed < 0) {
				if (grind == "evolve") {
					this.evolve_heroes();
				}
				if (grind == "hero") {
					this.level_heroes();
				}
				continue;
			}

			// otherwise, how long do we want to grind for
			// TODO: make grind a user variable
			var mob_gold = this.mob_multiplier() * base_stage_gold(this.current_stage);
			if (gold_needed < 200 * mob_gold) {
				var num_mobs = grind_target / mob_gold;
				var mob_hp = stage_hp(this.current_stage);
				this.current_gold += num_mobs * mob_gold;
				this.time += (mob_hp / (tapping * TAPS_PER_SECOND) + 4.5/6.0) * num_mobs;
			} else {
				end_game = true;
			}
		} // end while
		return [this.current_stage, this.time, this.total_relics() / this.time];
	};
}

var METHOD_GOLD = 0;
var METHOD_ALL_DAMAGE = 1;
var METHOD_TAP_DAMAGE = 2;
var METHOD_DMG_EQUIVALENT = 3;
var METHOD_RELICS_PS = 4;
var METHOD_STAGE_PS = 5;

var METHOD_TAP_DAMAGE_WITH_ACTIVES = 6;
var METHOD_DMG_EQUIVALENT_WITH_ACTIVES = 7;

var get_value = function(game_state, method) {
	switch (method) {
		case METHOD_GOLD:
			return game_state.gold_multiplier();
		case METHOD_ALL_DAMAGE:
			return game_state.a_ad;
		case METHOD_TAP_DAMAGE:
			return game_state.tap_damage()[1];
		case METHOD_DMG_EQUIVALENT:
			return [game_state.gold_multiplier(), game_state.tap_damage()[1]];
		case METHOD_RELICS_PS:
			return game_state.relics_per_second()[2];
		case METHOD_STAGE_PS:
			return game_state.relics_per_second().slice(0, 2);
		case METHOD_TAP_DAMAGE_WITH_ACTIVES:
			return game_state.tap_damage()[2];
		case METHOD_DMG_EQUIVALENT_WITH_ACTIVES:
			return [game_state.gold_multiplier(), game_state.tap_damage()[2]];
	}
};

var hashArray = function(array) {
	// TODO: find better hash?
	return array.toString();
};

var memoize = {};
var get_value_memoize = function(a, p, mo) {
	var w = p.w;
	var l = p.l;
	var c = p.c;
	var m = mo;
	if (p.s && m == METHOD_TAP_DAMAGE) {
		m = METHOD_TAP_DAMAGE_WITH_ACTIVES;
	} else if (p.s && m == METHOD_DMG_EQUIVALENT) {
		m = METHOD_DMG_EQUIVALENT_WITH_ACTIVES;
	}

	var aHash = m + hashArray(a);
	if (aHash in memoize) {
		return memoize[aHash];
	} else {
		var g = new GameState(a, w, l, c, { cs: p.t, br: p.z });
		// if rps or sps, will reset anyways
		g.get_all_skills();
		var base = get_value(g, m);
		memoize[aHash] = base;
		return base;
	}
};

var get_max = function(array, custom) {
	var max = array[0];
	var maxIndex = 0;
	for (var i = 1; i < array.length; i++) {
		if (custom(array[i], max)) {
			maxIndex = i;
			max = array[i];
		}
	}
	return max;
};

// artifacts, weapons, levels, customizations, relics, nsteps, method
var get_best = function(params, method) {
	var relics_left = params.r == 0 ? 1000000000 : params.r;
	var current_artifacts = params.a.slice();
	var steps = [];
	var cumulative = 0;

	var stepLimit = params.n == 0 ? 200 : params.n

	while (relics_left > 0 && steps.length < stepLimit) {
		var options = [];
		var base = get_value_memoize(current_artifacts, params, method);

		for (var i in current_artifacts) {
			var level = current_artifacts[i];
			if (level == 0 || level == artifact_info[i].levelcap) {
				continue;
			}
			var relic_cost = artifact_info[i].costToLevel(level);
			var artifacts_copy = current_artifacts.slice();
			artifacts_copy[i] += 1;

			// Future's Fortune for gold
			if (method == METHOD_GOLD && i == 10) {
				relic_cost = 0;
				var level_to = next_ff_level(current_artifacts[i], params.c[2]);
				artifacts_copy[i] = level_to;
				while (level_to > level) {
					level_to -= 1;
					relic_cost += artifact_info[i].costToLevel(level_to);
				}
			}

			// Future's Fortune for dmg_equivalent
			var ff_dmg_eq_gold;
			var ff_dmg_eq_levels;
			if ((method == METHOD_DMG_EQUIVALENT || method == METHOD_DMG_EQUIVALENT_WITH_ACTIVES) && i == 10) {
				var level_to = next_ff_level(current_artifacts[i], params.c[2]);
				var ff_gold_artifacts_copy = current_artifacts.slice();
				ff_gold_artifacts_copy[i] = level_to;
				ff_dmg_eq_levels = level_to - current_artifacts[i];
				ff_dmg_eq_gold = get_value_memoize(ff_gold_artifacts_copy, params, METHOD_GOLD);
			}

			var new_value = get_value_memoize(artifacts_copy, params, method);
			var e;
			if (method == METHOD_STAGE_PS) {
				e = [(new_value[0] - base[0]) / relic_cost, (base[1] - new_value[1]) / relic_cost];
			} else if (method == METHOD_DMG_EQUIVALENT || method == METHOD_DMG_EQUIVALENT_WITH_ACTIVES) {
				// https://www.reddit.com/r/TapTitans/comments/35e0wd/relationship_between_gold_and_damage/
				var gold_ratio = new_value[0] / base[0];
				if (i == 10) {
					gold_ratio = 1 + ((ff_dmg_eq_gold - base[0]) / ff_dmg_eq_levels) / base[0];
				}
				var tdmg_ratio = new_value[1] / base[1];
				var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
				// var total_change = tdmg_ratio * gold_dmg_equivalent;

				// e = (total_change - 1) / relic_cost;

				var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
				e = (eq_tdmg - base[1]) / relic_cost;
			} else {
				e = (new_value - base) / relic_cost;
			}

			options.push({
				efficiency: e,
				index: i,
				name: artifact_info[i].name,
				level: artifacts_copy[i],
				cost: relic_cost,
				cumulative: cumulative + relic_cost
			});
		}

		// pick best option
		var best_option = get_max(options, function(o1, o2) {
			if (method != METHOD_STAGE_PS) {
				return o1.efficiency > o2.efficiency;
			} else {
				if (o1.efficiency[0] > o2.efficiency[0]) {
					return true;
				} else if (o1.efficiency[0] < o2.efficiency[0]) {
					return false;
				}
				return o1.efficiency[1] > o2.efficiency[1];
			}
		});

		if (best_option.cost > relics_left && params.n == 0) {
			break;
		}
		relics_left -= best_option.cost;
		cumulative += best_option.cost;
		current_artifacts[best_option.index] = best_option.level;
		delete best_option.efficiency;
		steps.push(best_option);
	}
	return steps;
};

var get_steps = function(params) {
	// reset cache
	memoize = {};
	var response = {};
	for (var mi in params.m) {
		var m = params.m[mi];
		var steps = [];
		if (params.g == 1) {
			steps = get_best(params, m);
		} else {
			// TODO: shouldn't get here yet
			// steps = get_best_dp(artifacts, weapons, customizations, relics, nsteps, m, [])[1];
		}
		var summary = {};
		var costs = {};
		for (var s in steps) {
			var step = steps[s];
			var i = step["index"];
			summary[i] = Math.max(step["level"], summary[i] ? summary[i] : 0);
			costs[i] = (costs[i] ? costs[i] : 0) + step["cost"];
		}
		var summary_steps = []
		for (var key in summary) {
			var step = {};
			step["index"] = key;
			step["name"] = artifact_info[key].name;
			step["level"] = summary[key];
			step["cost"] = costs[key];
			summary_steps.push(step);
		}
		var m_response = {};
		m_response["steps"] = steps;
		m_response["summary"] = summary_steps;
		response[m] = m_response;
	}
	return response;
};

var calculate_weapons_probability = function(weapons) {
	// TODO: how does javascript not have a good statistics package
	var total = sumArray(weapons);
	if (total == 0) {
		return 1;
	}
	var expected = total / hero_info.length;
	var chi2 = 0;
	for (var i in weapons) {
		chi2 += Math.pow(weapons[i] - expected, 2) / expected;
	}
	var p = pochisq(chi2, hero_info.length - 1)
	return p;
};

 /*  The following JavaScript functions for calculating normal and
		chi-square probabilities and critical values were adapted by
		John Walker from C implementations
		written by Gary Perlman of Wang Institute, Tyngsboro, MA
		01879.  Both the original C code and this JavaScript edition
		are in the public domain.  */

/*  POZ  --  probability of normal z value

	Adapted from a polynomial approximation in:
			Ibbetson D, Algorithm 209
			Collected Algorithms of the CACM 1963 p. 616
	Note:
			This routine has six digit accuracy, so it is only useful for absolute
			z values < 6.  For z values >= to 6.0, poz() returns 0.0.
*/

var poz = function poz() {
	var y, x, w;
	var Z_MAX = 6.0;              /* Maximum meaningful z value */

	if (z == 0.0) {
		x = 0.0;
	} else {
		y = 0.5 * Math.abs(z);
		if (y >= (Z_MAX * 0.5)) {
			x = 1.0;
		} else if (y < 1.0) {
			w = y * y;
			x = ((((((((0.000124818987 * w
				- 0.001075204047) * w + 0.005198775019) * w
				- 0.019198292004) * w + 0.059054035642) * w
				- 0.151968751364) * w + 0.319152932694) * w
				- 0.531923007300) * w + 0.797884560593) * y * 2.0;
		} else {
			y -= 2.0;
			x = (((((((((((((-0.000045255659 * y
				+ 0.000152529290) * y - 0.000019538132) * y
				- 0.000676904986) * y + 0.001390604284) * y
				- 0.000794620820) * y - 0.002034254874) * y
				+ 0.006549791214) * y - 0.010557625006) * y
				+ 0.011630447319) * y - 0.009279453341) * y
				+ 0.005353579108) * y - 0.002141268741) * y
				+ 0.000535310849) * y + 0.999936657524;
		}
	}
	return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
}

var BIGX = 20.0;                  /* max value to represent exp(x) */

var ex = function (x) {
	return (x < -BIGX) ? 0.0 : Math.exp(x);
}

/*  POCHISQ  --  probability of chi-square value

Adapted from:
	Hill, I. D. and Pike, M. C.  Algorithm 299
	Collected Algorithms for the CACM 1967 p. 243
Updated for rounding errors based on remark in
	ACM TOMS June 1985, page 185
*/

var pochisq = function(x, df) {
	var a, y, s;
	var e, c, z;
	var even;                     /* True if df is an even number */

	var LOG_SQRT_PI = 0.5723649429247000870717135; /* log(sqrt(pi)) */
	var I_SQRT_PI = 0.5641895835477562869480795;   /* 1 / sqrt(pi) */

	if (x <= 0.0 || df < 1) {
		return 1.0;
	}

	a = 0.5 * x;
	even = !(df & 1);
	if (df > 1) {
		y = ex(-a);
	}
	s = (even ? y : (2.0 * poz(-Math.sqrt(x))));
	if (df > 2) {
		x = 0.5 * (df - 1.0);
		z = (even ? 1.0 : 0.5);
		if (a > BIGX) {
			e = (even ? 0.0 : LOG_SQRT_PI);
			c = Math.log(a);
			while (z <= x) {
				e = Math.log(z) + e;
				s += ex(c * z - a - e);
				z += 1.0;
			}
			return s;
		} else {
			e = (even ? 1.0 : (I_SQRT_PI / Math.sqrt(a)));
			c = 0.0;
			while (z <= x) {
				e = e * (a / z);
				c = c + e;
				z += 1.0;
			}
			return c * y + s;
		}
	} else {
		return s;
	}
}