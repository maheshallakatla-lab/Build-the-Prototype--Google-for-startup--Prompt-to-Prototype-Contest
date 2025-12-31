
import React from 'react';
import { 
  Database, 
  Cpu, 
  Network, 
  Cloud, 
  Bot, 
  Calculator 
} from 'lucide-react';
import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: "pbi-sql",
    title: "Power BI & SQL Excellence",
    price: 4999,
    free: false,
    description: "Full-stack Data Intelligence mastery.",
    details: "Learn to build production-grade dashboards and manage complex relational databases with SQL. This course covers everything from basic queries to advanced DAX patterns.",
    modules: ["SQL Advanced Joins", "Power BI DAX Patterns", "Visual Storytelling", "Performance Tuning"],
    cert: "Microsoft PL-300",
    icon: "Database"
  },
  {
    id: "ms-fabric",
    title: "Microsoft Fabric Elite",
    price: 5999,
    free: false,
    description: "The future of unified analytics.",
    details: "Master the all-in-one analytics solution from Microsoft. Learn OneLake, Data Factory, Synapse, and Real-time Analytics in a single cohesive platform.",
    modules: ["OneLake Security", "Fabric Data Factory", "Real-time Analytics", "Lakehouse Architecture"],
    cert: "Microsoft DP-600",
    icon: "Network"
  },
  {
    id: "agentic-ai",
    title: "Agentic AI Swarms",
    price: 0,
    free: true,
    description: "Building autonomous AI agents.",
    details: "Dive into the cutting-edge world of autonomous AI. Learn to build multi-agent systems that can plan, reason, and execute tasks independently.",
    modules: ["LLM Orchestration", "Agentic RAG", "Multi-Agent Systems", "AutoGPT Patterns"],
    cert: "MA Global AI Cert",
    icon: "Bot"
  },
  {
    id: "azure-de",
    title: "Azure Data Engineering",
    price: 5999,
    free: false,
    description: "Scale data pipelines on Cloud.",
    details: "Become an expert in cloud-based data movement and transformation. Learn to use Azure's most powerful data tools to build scalable pipelines.",
    modules: ["Azure Databricks", "Data Factory ETL", "Synapse Analytics", "ADLS Gen2 Patterns"],
    cert: "Microsoft DP-203",
    icon: "Cloud"
  },
  {
    id: "rpa-pro",
    title: "RPA Automation Pro",
    price: 4999,
    free: false,
    description: "Master enterprise automation.",
    details: "Learn to automate repetitive business processes using enterprise-grade RPA tools. Increase efficiency and reduce errors in any organization.",
    modules: ["UiPath Studio", "Blue Prism", "Bot Life Cycle", "Queue Management"],
    cert: "Global RPA Cert",
    icon: "Cpu"
  },
  {
    id: "math-research",
    title: "Mathematics & Research",
    price: 2999,
    free: false,
    description: "Foundational logic and stats.",
    details: "The bedrock of data science and AI. Deep dive into the mathematical principles that power modern algorithms and statistical models.",
    modules: ["Linear Algebra", "Probability Theory", "Statistical Inference", "Optimization"],
    cert: "Academic Excellence Cert",
    icon: "Calculator"
  }
];

export const getIcon = (name: string) => {
  switch (name) {
    case 'Database': return <Database className="w-6 h-6" />;
    case 'Cpu': return <Cpu className="w-6 h-6" />;
    case 'Network': return <Network className="w-6 h-6" />;
    case 'Cloud': return <Cloud className="w-6 h-6" />;
    case 'Bot': return <Bot className="w-6 h-6" />;
    case 'Calculator': return <Calculator className="w-6 h-6" />;
    default: return <Database className="w-6 h-6" />;
  }
};
