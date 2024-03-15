import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    GetCommand,
    GetCommandInput,
    PutCommand
} from "@aws-sdk/lib-dynamodb"
import {fromIni} from "@aws-sdk/credential-provider-ini";
import {InternalServerError} from "../errors/InternalServerError";

const client = new DynamoDBClient({credentials: fromIni({ profile: process.env.AWS_PROFILE }), region: 'us-east-1'});

export const getItem = async <T>(params: GetCommandInput): Promise<T | undefined> => {
    const command = new GetCommand(params);
    const response = await client.send(command);
    if (!response.Item) {
        return;
    }
    return response.Item as T;
};

export const putItem = async (tableName: string, item: object): Promise<void> => {
    const command = new PutCommand({
        TableName: tableName,
        Item: item
    });
    try {
        await client.send(command);
    } catch (error: any) {
        throw new InternalServerError(`Error occurred while putting item ${item}`);
    }
};