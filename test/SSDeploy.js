const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SimpleStorage init", function () {
  async function getContract() {
    const [owner, PA] = await ethers.getSigners();

    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simplestorage = await SimpleStorageFactory.deploy();

    return { owner, simplestorage };
  }

  describe("Deployment", function () {
    it("Calling retrieve function", async function () {
      const { owner, simplestorage } = await loadFixture(getContract);
      const retrieve = await simplestorage.retrieve();

      expect(retrieve).to.equal(0);
    });
  });

  describe("store", function () {
    it("storing the value", async () => {
      const value = 17;
      const { simplestorage } = await loadFixture(getContract);
      const store = await simplestorage.store(value);
      await store.wait();
      const retrieve = await simplestorage.retrieve();

      expect(retrieve).to.equal(value);
    });
  });

  describe("Add person", function () {
    it("adding favorite person", async () => {
      const name = "phil";
      const age = 17;

      const { simplestorage } = await loadFixture(getContract);
      const addPerson = await simplestorage.addPerson(name, age);
      await addPerson.wait();

      const personDetails = await simplestorage.people(0);

      expect(personDetails.name).equal(name);
    });

    it("Adding favorite persons array", async () => {
      const persons = [
        { name: "phil", age: 24 },
        { name: "mom", age: 63 },
        { name: "Ay", age: 38 },
        { name: "Ibk", age: 39 },
      ];
      const { simplestorage } = await loadFixture(getContract);

      for (const details of persons) {
        const addPerson = await simplestorage.addPerson(
          details.name,
          details.age
        );
        await addPerson.wait();
      }

      for (let i = 0; i < persons.length; i++) {
        const people = await simplestorage.people(i);
        const person = persons[i];

        expect(people.name).to.equal(person.name);

        const nameToFavoriteNumber = await simplestorage.nameToFavoriteNumber(
          person.name
        );

        expect(nameToFavoriteNumber).to.equal(person.age);
      }
    });
  });
});
