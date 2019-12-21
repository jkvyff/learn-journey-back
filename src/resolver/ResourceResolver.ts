import { Resolver, Mutation, Arg, Query, InputType, Field, Int, ArgsType, Args } from "type-graphql";
import puppeteer from "puppeteer";
import { Resource } from "../entity/Resource";
import { Min, Max } from "class-validator";

@InputType()
class ResourceInput {
    @Field()
    title: String

    @Field()
    author: String

    @Field()
    exerpt: String

    @Field()
    resolved_url: String

    @Field(() => Int)
    time_length: number
}

@InputType()
class ResourceUpdateInput {
    @Field()
    title: String

    @Field(() => String, { nullable: true })
    author?: String

    @Field(() => String, { nullable: true })
    exerpt?: String

    @Field()
    resolved_url: String

    @Field(() => Int, { nullable: true })
    time_length: number
}

@ArgsType()
class ResourcesArgs {
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 20;
}

@Resolver()
export class ResourceResolver {
    @Mutation(() => Resource)
    async createResource(
        @Arg("options", () => ResourceInput) options: ResourceInput
    ) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(String(options.resolved_url));
        await page.screenshot({path: 'example.png'});
        await browser.close();

        const resource = await Resource.create(options).save();

        console.log(resource);
        return resource;
    }

    @Mutation(() => Boolean)
    async updateResource(
        @Arg("id", () => Int) id: number,
        @Arg("input",  () => ResourceUpdateInput) input: ResourceUpdateInput
    ) {
        await Resource.update({id}, input)
        return true
    }

    @Mutation(() => Boolean)
    async deleteResource(
        @Arg("id", () => Int) id: number
    ) {
        await Resource.delete({id})
        return true
    }

    @Query(() => [Resource]) 
    resources(
        @Args() { skip, take }: ResourcesArgs
    ) {
        return Resource.find({ skip, take });
    }
}