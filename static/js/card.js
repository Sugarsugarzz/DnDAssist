/**
* @Author:Zhaohongru
* 角色卡的基本属性以及属性计算逻辑
* 
*/


class Character{
	constructor(){
		this.baseAttr = new CNBaseAttribute();
		this.spellArray = {}; //技能与法术列表
		this.proficiency = {}; //熟练项
	}

	generateCharacterJson(){

	}
}

/**
* 尝试用中文作为变量名
* 在无法识别UTF-8的浏览器中可能会出现问题
*/
class CNBaseAttribute {
	constructor(){
		this.角色名 = "", // 角色名
		this.职业 = ""; //职业
		this.等级 = ""; //等级
		this.背景 = ""; //背景
		this.玩家名 = ""; //玩家名
		this.种族 = ""; //种族
		this.阵营 = ""; //阵营
		this.经验值 = ""; //经验值
		this.熟练加值 = ""; //熟练加值
		this.激励 = ""; //激励

		//属性的子项可以根据属性和熟练项算出来
		this.力量 = ""; //力量
		this.敏捷 = ""; //敏捷
		this.体质 = ""; //体质
		this.智力 = ""; //智力
		this.感知 = ""; //感知
		this.魅力 = ""; //魅力

		this.生命值 = ""; //生命值
		this.临时生命值 = ""; //临时生命值
		this.生命骰 = ""; //生命骰

		this.死亡豁免 = ""; //死亡豁免

		this.特点 = ""; //特点
		this.理想 = ""; //理想
		this.牵绊 = ""; //牵绊
		this.缺点 = ""; //缺点
		this.特性 = ""; //特性
		this.额外熟练 = ""; //额外熟练
		this.语言 = ""; //语言
		this.所有装备 = ""; //所有装备+物品
		this.携带钱币 = ""; //携带钱币

		this.年龄 = ""; //年龄
		this.身高 = ""; //身高
		this.体重 = ""; //体重
		this.瞳色 = ""; //瞳色
		this.肤色 = ""; //肤色
		this.发色 = ""; //发色
		this.形象 = ""; //形象

		this.同盟 = ""; //同盟
		this.徽记 = ""; //徽记
		this.背景故事 = ""; //背景故事
		this.额外特性 = ""; //额外特性
		this.携带财宝 = ""; //携带财宝
	}
}
/**
* 角色基本属性
*/
class BaseAttribute {
	constructor(){
		this.characterName = "", // 角色名
		this.clazz = ""; //职业
		this.level = ""; //等级
		this.background = ""; //背景
		this.playerName = ""; //玩家名
		this.race = ""; //种族
		this.alignment = ""; //阵营
		this.exp = ""; //经验值
		this.proficiencyBonus = ""; //熟练加值
		this.inspiration = ""; //激励

		//属性的子项可以根据属性和熟练项算出来
		this.strength = ""; //力量
		this.dexterity = ""; //敏捷
		this.constitution = ""; //体质
		this.intelligent = ""; //智力
		this.wisdom = ""; //感知
		this.charisma = ""; //魅力

		this.hp = ""; //生命值
		this.temporaryHp = ""; //临时生命值
		this.hitDice = ""; //生命骰

		this.deathSavingThrows = ""; //死亡豁免

		this.characteristics = ""; //特点
		this.ideal = ""; //理想
		this.bond = ""; //牵绊
		this.flaw = ""; //缺点
		this.feature = ""; //特性
		this.extraProficiency = ""; //额外熟练
		this.language = ""; //语言
		this.item = ""; //所有装备+物品
		this.money = ""; //携带钱币

		this.age = ""; //年龄
		this.height = ""; //身高
		this.weight = ""; //体重
		this.pupilColor = ""; //瞳色
		this.skinColor = ""; //肤色
		this.hairColor = ""; //发色
		this.image = ""; //形象

		this.alliance = ""; //同盟
		this.sign = ""; //徽记
		this.backgroundStory = ""; //背景故事
		this.extraFeature = ""; //额外特性
		this.treasure = ""; //携带财宝
	}

	/**
	* 设置某一属性的方法
	* @param attrName 属性key
	* @param attrValue 属性value
	*/
	setAttr(attrName, attrValue){
		if(attrName == "SpellArray"){
			alert("error");
			return;
		}
		this[attrName] = attrValue;
	}

	/**
	* 获取某一属性的方法
	* @param attrName 属性key
	* @return 属性value
	*/
	getAttr(attrName){
		if(attrName == "SpellArray"){
			alert("error");
			return;
		}
		return this[attrName];
	}


}

/**
* 伤害技能，包括攻击和法术
*/
function Spell(){
	this.spellLevel = ""; //法术环阶, -1代表非法术，0代表戏法
	this.name = ""; //名称
	this.damage = ""; //伤害，通常为 xdy 的形式
	this.type = ""; //伤害类型
}