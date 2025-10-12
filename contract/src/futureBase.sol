// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FutureBase is Ownable, ReentrancyGuard {
    struct Letter {
        address owner;
        string ipfsHash;
        uint256 releaseTime;
        bool delivered;
        uint256 createdAt;
    }

    uint256 public constant MAX_RELEASE_TIME = 3_155_760_00;
    uint256 public constant MIN_RELEASE_OFFSET = 60;

    mapping(uint256 => Letter) public letters;
    mapping(address => uint256[]) public userLetters;

    uint256 public letterCounter;
    uint256 private platformFeeBps;
    address private treasury;

    // Events
    event LetterCreated(
        uint256 indexed letterId,
        address indexed owner,
        string ipfsHash,
        uint256 releaseTime
    );
    event LetterClaimed(
        uint256 indexed letterId,
        address indexed owner,
        uint256 releasedTime
    );
    event PlatformFeeUpdated(uint256 indexed newFeeBps);
    event TreasuryUpdated(address indexed newTreasury);

    // Errors

    error LetterNotYetAvailable();
    error LetterHasBeenDelivered();
    error NotLetterOwner();
    error LetterNotFound();
    error InvalidReleaseTime();
    error InvalidIPFSHash();
    error InvalidTreasuryAddress();
    error FeeTooHigh();

    //constructor
    constructor(
        address _treasury,
        uint256 _platformFeeBps
    ) Ownable(msg.sender) {
        if (_treasury == address(0)) {
            revert InvalidTreasuryAddress();
        }
        if (_platformFeeBps > 500) {
            revert FeeTooHigh();
        }

        treasury = _treasury;
        platformFeeBps = _platformFeeBps;
        letterCounter = 1;

        emit PlatformFeeUpdated(_platformFeeBps);
        emit TreasuryUpdated(_treasury);
    }

    function createLetter(
        string calldata _ipfsHash,
        uint256 _releaseTime
    ) external nonReentrant returns (uint256) {
        if (bytes(_ipfsHash).length == 0) {
            revert InvalidIPFSHash();
        }
        //validate the release time is in the future
        uint256 minReleaseTime = block.timestamp + MIN_RELEASE_OFFSET;
        if (
            _releaseTime < minReleaseTime ||
            _releaseTime > block.timestamp + MAX_RELEASE_TIME
        ) {
            revert InvalidReleaseTime();
        }

        uint256 letterId = letterCounter;
        unchecked {
            letterCounter++;
        }

        letters[letterId] = Letter({
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            releaseTime: _releaseTime,
            delivered: false,
            createdAt: block.timestamp
        });

        userLetters[msg.sender].push(letterId);
        emit LetterCreated(letterId, msg.sender, _ipfsHash, _releaseTime);
        return letterId;
    }

    function claimLetter(
        uint256 _letterId
    ) external nonReentrant returns (string memory) {
        Letter storage letter = letters[_letterId];

        if (letter.owner == address(0)) {
            revert LetterNotFound();
        }
        if (msg.sender != letter.owner) {
            revert NotLetterOwner();
        }
        if (letter.delivered) {
            revert LetterHasBeenDelivered();
        }
        if (block.timestamp < letter.releaseTime) {
            revert LetterNotYetAvailable();
        }

        letter.delivered = true;

        emit LetterClaimed(_letterId, msg.sender, block.timestamp);
        return letter.ipfsHash;
    }

    //getter functions

    function getLetter(
        uint256 _letterId
    )
        external
        view
        returns (
            address owner,
            string memory ipfsHash,
            uint256 releaseTime,
            bool delivered,
            uint256 createdAt,
            bool isAvailable
        )
    {
        Letter storage letter = letters[_letterId];

        //only return ipfs hash if the caller is owner and released time has passed
        bool shouldRevealIpfsHash = (block.timestamp >= letter.releaseTime &&
            msg.sender == letter.owner);

        return (
            letter.owner,
            shouldRevealIpfsHash ? letter.ipfsHash : "",
            letter.releaseTime,
            letter.delivered,
            letter.createdAt,
            block.timestamp >= letter.releaseTime && !letter.delivered
        );
    }

    // return Arrays of letterID owned by a specific user
    function getUserLetter(
        address _user
    ) external view returns (uint256[] memory) {
        return userLetters[_user];
    }

    function getUserLetterCount(address _user) external view returns (uint256) {
        return userLetters[_user].length;
    }

    // functions to be called only by ADMIN

    function setPlatformFee(uint256 _newFeeBps) external onlyOwner {
        if (_newFeeBps > 500) revert FeeTooHigh();
        platformFeeBps = _newFeeBps;
        emit PlatformFeeUpdated(_newFeeBps);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        if (_newTreasury == address(0)) revert InvalidTreasuryAddress();
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }

    function isLetterAvailable(uint256 _letterId) external view returns (bool) {
        Letter memory letter = letters[_letterId];
        if (letter.owner == address(0)) revert LetterNotFound();
        return block.timestamp >= letter.releaseTime && !letter.delivered;
    }

    function getTimeUntilRelease(
        uint256 _letterId
    ) external view returns (uint256) {
        Letter memory letter = letters[_letterId];
        if (letter.owner == address(0)) revert LetterNotFound();

        if (block.timestamp >= letter.releaseTime) {
            return 0;
        }
        return letter.releaseTime - block.timestamp;
    }
}
